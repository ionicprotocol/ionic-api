import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types/supabase.types';
import { Chain } from '../types/chain.type';
import { getChainId } from '../utils/chain.utils';
import { MarketSearchQueryDto } from '../../ionic/dto/market-search.dto';

type Tables = Database['public']['Tables'];
type AssetMasterData = Tables['asset_master_data_test2']['Row'];

@Injectable()
export class SupabaseService {
  private readonly supabase: SupabaseClient<Database>;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.getOrThrow<string>('SUPABASE_URL');
    const supabaseKey = this.configService.getOrThrow<string>('SUPABASE_KEY');

    this.supabase = createClient<Database>(supabaseUrl, supabaseKey);
  }

  async getAssetMasterData(
    chain: Chain,
    query: MarketSearchQueryDto,
  ): Promise<AssetMasterData[]> {
    let queryBuilder = this.supabase
      .from('asset_master_data_test2')
      .select('*')
      .eq('chain_id', getChainId(chain));

    // Apply filters based on query parameters
    if (query.asset || query.underlyingSymbol) {
      const symbol = query.asset || query.underlyingSymbol;
      if (symbol) {
        queryBuilder = queryBuilder.eq('underlying_symbol', symbol);
      }
    }
    if (query.address) {
      queryBuilder = queryBuilder.eq('ctoken_address', query.address);
    }
    if (query.poolAddress) {
      queryBuilder = queryBuilder.eq('pool_address', query.poolAddress);
    }
    if (query.underlyingAddress) {
      queryBuilder = queryBuilder.eq(
        'underlying_address',
        query.underlyingAddress,
      );
    }
    if (query.underlyingName) {
      queryBuilder = queryBuilder.eq('underlying_name', query.underlyingName);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      throw error;
    }

    return data || [];
  }
}
