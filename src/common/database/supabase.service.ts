import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types/supabase.types';
import { getChainId } from '../utils/chain.utils';
import { MarketSearchQueryDto } from '../dto/market-search.dto';

type Tables = Database['public']['Tables'];
type AssetMasterData = Tables['asset_master_data_main']['Row'];

@Injectable()
export class SupabaseService {
  private readonly supabase: SupabaseClient<Database>;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.getOrThrow<string>('SUPABASE_URL');
    const supabaseKey = this.configService.getOrThrow<string>('SUPABASE_KEY');

    this.logger.log(`Supabase URL: ${supabaseUrl}`);
    this.logger.log(`Supabase Key: ${supabaseKey}`);

    this.supabase = createClient<Database>(supabaseUrl, supabaseKey);
  }

  async getAssetMasterData(
    query: MarketSearchQueryDto = {},
  ): Promise<AssetMasterData[]> {
    let queryBuilder = this.supabase
      .from('asset_master_data_main')
      .select('*')
      .order('timestamp', { ascending: false });

    // Apply chain filter if provided
    if (query.chain) {
      queryBuilder = queryBuilder.eq('chain_id', getChainId(query.chain));
    }

    // Apply filters with case-insensitive comparisons
    if (query.asset || query.collateralTokenSymbol) {
      const symbol = query.asset || query.collateralTokenSymbol;
      if (symbol) {
        queryBuilder = queryBuilder.ilike('underlying_symbol', symbol);
      }
    }
    if (query.address) {
      queryBuilder = queryBuilder.ilike('ctoken_address', query.address);
    }
    if (query.poolId) {
      queryBuilder = queryBuilder.ilike('pool_address', query.poolId);
    }
    if (query.borrowTokenSymbol) {
      queryBuilder = queryBuilder.ilike(
        'underlying_symbol',
        query.borrowTokenSymbol,
      );
    }

    const { data, error } = await queryBuilder;

    if (error) {
      throw error;
    }

    // Group data by pool_address to get latest data for each pool
    const latestPoolData = data.reduce<Record<string, AssetMasterData>>(
      (acc, curr) => {
        const key = `${curr.chain_id}-${curr.pool_address}-${curr.underlying_symbol}`;
        if (!acc[key] || curr.timestamp > acc[key].timestamp) {
          acc[key] = curr;
        }
        return acc;
      },
      {},
    );
    return Object.values(latestPoolData);
  }
}
