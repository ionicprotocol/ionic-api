import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types/supabase.types';
import { Chain } from '../types/chain.type';
import { getChainId } from '../utils/chain.utils';

type Tables = Database['public']['Tables'];

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
    underlyingSymbol: string,
  ): Promise<Tables['asset_master_data_test2']['Row'] | null> {
    const { data, error } = await this.supabase
      .from('asset_master_data_test2')
      .select('*')
      .eq('chain_id', getChainId(chain))
      .eq('underlying_symbol', underlyingSymbol)
      .limit(1)
      .single();

    if (error) {
      throw error;
    }

    return data;
  }
}
