import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types/supabase.types';
import { getChainId } from '../utils/chain.utils';
import { MarketSearchQueryDto } from '../../ionic/dto/market-search.dto';

type Tables = Database['public']['Tables'];
type AssetMasterData = Tables['asset_master_data_test2']['Row'];

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
      .limit(1); // for now limit 1 until table is fixed

    // Apply chain filter if provided
    if (query.chain) {
      queryBuilder = queryBuilder.eq('chain_id', getChainId(query.chain));
    }

    // Apply filters with case-insensitive comparisons
    if (query.asset || query.underlyingSymbol) {
      const symbol = query.asset || query.underlyingSymbol;
      if (symbol) {
        queryBuilder = queryBuilder.ilike('underlying_symbol', symbol);
      }
    }
    if (query.address) {
      queryBuilder = queryBuilder.ilike('ctoken_address', query.address);
    }
    if (query.poolAddress) {
      queryBuilder = queryBuilder.ilike('pool_address', query.poolAddress);
    }
    if (query.underlyingAddress) {
      queryBuilder = queryBuilder.ilike(
        'underlying_address',
        query.underlyingAddress,
      );
    }
    if (query.underlyingName) {
      queryBuilder = queryBuilder.ilike(
        'underlying_name',
        query.underlyingName,
      );
    }

    const { data, error } = await queryBuilder;

    if (error) {
      throw error;
    }

    return data || [];
  }
}
