export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      accrue_rewards_events: {
        Row: {
          allEventArgs: Json | null;
          blockNumber: string | null;
          chain: string | null;
          created_at: string;
          event_type: string | null;
          id: number;
          logIndex: string | null;
          strategy: string | null;
          timestamp: string | null;
          transactionHash: string | null;
          user: string | null;
        };
        Insert: {
          allEventArgs?: Json | null;
          blockNumber?: string | null;
          chain?: string | null;
          created_at?: string;
          event_type?: string | null;
          id?: number;
          logIndex?: string | null;
          strategy?: string | null;
          timestamp?: string | null;
          transactionHash?: string | null;
          user?: string | null;
        };
        Update: {
          allEventArgs?: Json | null;
          blockNumber?: string | null;
          chain?: string | null;
          created_at?: string;
          event_type?: string | null;
          id?: number;
          logIndex?: string | null;
          strategy?: string | null;
          timestamp?: string | null;
          transactionHash?: string | null;
          user?: string | null;
        };
        Relationships: [];
      };
      airdrop: {
        Row: {
          claimed: boolean;
          created_at: string;
          id: number;
          ion_amount: string;
          nonce: string | null;
          user: string;
        };
        Insert: {
          claimed?: boolean;
          created_at?: string;
          id?: number;
          ion_amount: string;
          nonce?: string | null;
          user: string;
        };
        Update: {
          claimed?: boolean;
          created_at?: string;
          id?: number;
          ion_amount?: string;
          nonce?: string | null;
          user?: string;
        };
        Relationships: [];
      };
      airdrop_season_2: {
        Row: {
          claimed: boolean | null;
          created_at: string;
          distributed: boolean;
          distribution_date: string | null;
          distribution_tx_hash: string | null;
          id: number;
          initial_ion_sent: number | null;
          ion_amount: string | null;
          nonce: string | null;
          remaining_ion: number | null;
          user: string | null;
          vesting_set: boolean;
        };
        Insert: {
          claimed?: boolean | null;
          created_at?: string;
          distributed?: boolean;
          distribution_date?: string | null;
          distribution_tx_hash?: string | null;
          id?: number;
          initial_ion_sent?: number | null;
          ion_amount?: string | null;
          nonce?: string | null;
          remaining_ion?: number | null;
          user?: string | null;
          vesting_set?: boolean;
        };
        Update: {
          claimed?: boolean | null;
          created_at?: string;
          distributed?: boolean;
          distribution_date?: string | null;
          distribution_tx_hash?: string | null;
          id?: number;
          initial_ion_sent?: number | null;
          ion_amount?: string | null;
          nonce?: string | null;
          remaining_ion?: number | null;
          user?: string | null;
          vesting_set?: boolean;
        };
        Relationships: [];
      };
      airdrop_szn2_dummy: {
        Row: {
          claimed: boolean | null;
          created_at: string;
          distributed: boolean;
          distribution_date: string | null;
          distribution_tx_hash: string | null;
          id: number;
          initial_ion_sent: number | null;
          ion_amount: string | null;
          nonce: string | null;
          remaining_ion: number | null;
          user: string | null;
          vesting_set: boolean;
        };
        Insert: {
          claimed?: boolean | null;
          created_at?: string;
          distributed?: boolean;
          distribution_date?: string | null;
          distribution_tx_hash?: string | null;
          id?: number;
          initial_ion_sent?: number | null;
          ion_amount?: string | null;
          nonce?: string | null;
          remaining_ion?: number | null;
          user?: string | null;
          vesting_set?: boolean;
        };
        Update: {
          claimed?: boolean | null;
          created_at?: string;
          distributed?: boolean;
          distribution_date?: string | null;
          distribution_tx_hash?: string | null;
          id?: number;
          initial_ion_sent?: number | null;
          ion_amount?: string | null;
          nonce?: string | null;
          remaining_ion?: number | null;
          user?: string | null;
          vesting_set?: boolean;
        };
        Relationships: [];
      };
      asset_master_data_main: {
        Row: {
          block_number: number;
          borrow_apy: number | null;
          borrow_cap: string | null;
          chain_id: number;
          collateral_factor: number | null;
          ctoken_address: string;
          decimals: number;
          exchange_rate: number | null;
          id: number;
          is_borrow_paused: boolean | null;
          is_listed: boolean | null;
          is_mint_paused: boolean | null;
          pool_address: string;
          reserve_factor: number | null;
          reward_apy: string | null;
          reward_apy_borrow: string | null;
          reward_apy_supply: string | null;
          reward_tokens: string | null;
          supply_apy: number | null;
          supply_cap: string | null;
          timestamp: string;
          total_borrow: string | null;
          total_borrow_apy: number | null;
          total_borrow_usd: number | null;
          total_supply: string | null;
          total_supply_apy: string | null;
          total_supply_usd: number | null;
          underlying_address: string;
          underlying_name: string;
          underlying_price: number | null;
          underlying_symbol: string;
          updated_at: string;
          usd_price: number | null;
          utilization_rate: number | null;
        };
        Insert: {
          block_number: number;
          borrow_apy?: number | null;
          borrow_cap?: string | null;
          chain_id: number;
          collateral_factor?: number | null;
          ctoken_address: string;
          decimals: number;
          exchange_rate?: number | null;
          id?: number;
          is_borrow_paused?: boolean | null;
          is_listed?: boolean | null;
          is_mint_paused?: boolean | null;
          pool_address: string;
          reserve_factor?: number | null;
          reward_apy?: string | null;
          reward_apy_borrow?: string | null;
          reward_apy_supply?: string | null;
          reward_tokens?: string | null;
          supply_apy?: number | null;
          supply_cap?: string | null;
          timestamp: string;
          total_borrow?: string | null;
          total_borrow_apy?: number | null;
          total_borrow_usd?: number | null;
          total_supply?: string | null;
          total_supply_apy?: string | null;
          total_supply_usd?: number | null;
          underlying_address: string;
          underlying_name: string;
          underlying_price?: number | null;
          underlying_symbol: string;
          updated_at: string;
          usd_price?: number | null;
          utilization_rate?: number | null;
        };
        Update: {
          block_number?: number;
          borrow_apy?: number | null;
          borrow_cap?: string | null;
          chain_id?: number;
          collateral_factor?: number | null;
          ctoken_address?: string;
          decimals?: number;
          exchange_rate?: number | null;
          id?: number;
          is_borrow_paused?: boolean | null;
          is_listed?: boolean | null;
          is_mint_paused?: boolean | null;
          pool_address?: string;
          reserve_factor?: number | null;
          reward_apy?: string | null;
          reward_apy_borrow?: string | null;
          reward_apy_supply?: string | null;
          reward_tokens?: string | null;
          supply_apy?: number | null;
          supply_cap?: string | null;
          timestamp?: string;
          total_borrow?: string | null;
          total_borrow_apy?: number | null;
          total_borrow_usd?: number | null;
          total_supply?: string | null;
          total_supply_apy?: string | null;
          total_supply_usd?: number | null;
          underlying_address?: string;
          underlying_name?: string;
          underlying_price?: number | null;
          underlying_symbol?: string;
          updated_at?: string;
          usd_price?: number | null;
          utilization_rate?: number | null;
        };
        Relationships: [];
      };
      asset_master_data_test2: {
        Row: {
          block_number: number;
          borrow_apy: number | null;
          borrow_cap: string | null;
          chain_id: number;
          collateral_factor: number | null;
          ctoken_address: string;
          decimals: number;
          exchange_rate: number | null;
          id: number;
          is_borrow_paused: boolean | null;
          is_listed: boolean | null;
          is_mint_paused: boolean | null;
          pool_address: string;
          reserve_factor: number | null;
          reward_apy: string | null;
          reward_apy_borrow: string | null;
          reward_apy_supply: string | null;
          reward_tokens: string | null;
          supply_apy: number | null;
          supply_cap: string | null;
          timestamp: string;
          total_borrow: string | null;
          total_borrow_apy: number | null;
          total_borrow_usd: number | null;
          total_supply: string | null;
          total_supply_apy: string | null;
          total_supply_usd: number | null;
          underlying_address: string;
          underlying_name: string;
          underlying_price: number | null;
          underlying_symbol: string;
          updated_at: string;
          usd_price: number | null;
          utilization_rate: number | null;
        };
        Insert: {
          block_number: number;
          borrow_apy?: number | null;
          borrow_cap?: string | null;
          chain_id: number;
          collateral_factor?: number | null;
          ctoken_address: string;
          decimals: number;
          exchange_rate?: number | null;
          id?: number;
          is_borrow_paused?: boolean | null;
          is_listed?: boolean | null;
          is_mint_paused?: boolean | null;
          pool_address: string;
          reserve_factor?: number | null;
          reward_apy?: string | null;
          reward_apy_borrow?: string | null;
          reward_apy_supply?: string | null;
          reward_tokens?: string | null;
          supply_apy?: number | null;
          supply_cap?: string | null;
          timestamp: string;
          total_borrow?: string | null;
          total_borrow_apy?: number | null;
          total_borrow_usd?: number | null;
          total_supply?: string | null;
          total_supply_apy?: string | null;
          total_supply_usd?: number | null;
          underlying_address: string;
          underlying_name: string;
          underlying_price?: number | null;
          underlying_symbol: string;
          updated_at: string;
          usd_price?: number | null;
          utilization_rate?: number | null;
        };
        Update: {
          block_number?: number;
          borrow_apy?: number | null;
          borrow_cap?: string | null;
          chain_id?: number;
          collateral_factor?: number | null;
          ctoken_address?: string;
          decimals?: number;
          exchange_rate?: number | null;
          id?: number;
          is_borrow_paused?: boolean | null;
          is_listed?: boolean | null;
          is_mint_paused?: boolean | null;
          pool_address?: string;
          reserve_factor?: number | null;
          reward_apy?: string | null;
          reward_apy_borrow?: string | null;
          reward_apy_supply?: string | null;
          reward_tokens?: string | null;
          supply_apy?: number | null;
          supply_cap?: string | null;
          timestamp?: string;
          total_borrow?: string | null;
          total_borrow_apy?: number | null;
          total_borrow_usd?: number | null;
          total_supply?: string | null;
          total_supply_apy?: string | null;
          total_supply_usd?: number | null;
          underlying_address?: string;
          underlying_name?: string;
          underlying_price?: number | null;
          underlying_symbol?: string;
          updated_at?: string;
          usd_price?: number | null;
          utilization_rate?: number | null;
        };
        Relationships: [];
      };
      asset_master_data_test2_duplicate: {
        Row: {
          block_number: number;
          borrow_apy: number | null;
          borrow_cap: string | null;
          chain_id: number;
          collateral_factor: number | null;
          ctoken_address: string;
          decimals: number;
          exchange_rate: number | null;
          id: number;
          is_borrow_paused: boolean | null;
          is_listed: boolean | null;
          is_mint_paused: boolean | null;
          pool_address: string;
          reserve_factor: number | null;
          reward_apy: string | null;
          reward_apy_borrow: string | null;
          reward_apy_supply: string | null;
          reward_tokens: string | null;
          supply_apy: number | null;
          supply_cap: string | null;
          timestamp: string;
          total_borrow: string | null;
          total_borrow_apy: number | null;
          total_borrow_usd: number | null;
          total_supply: string | null;
          total_supply_apy: string | null;
          total_supply_usd: number | null;
          underlying_address: string;
          underlying_name: string;
          underlying_price: number | null;
          underlying_symbol: string;
          updated_at: string;
          usd_price: number | null;
          utilization_rate: number | null;
        };
        Insert: {
          block_number: number;
          borrow_apy?: number | null;
          borrow_cap?: string | null;
          chain_id: number;
          collateral_factor?: number | null;
          ctoken_address: string;
          decimals: number;
          exchange_rate?: number | null;
          id?: number;
          is_borrow_paused?: boolean | null;
          is_listed?: boolean | null;
          is_mint_paused?: boolean | null;
          pool_address: string;
          reserve_factor?: number | null;
          reward_apy?: string | null;
          reward_apy_borrow?: string | null;
          reward_apy_supply?: string | null;
          reward_tokens?: string | null;
          supply_apy?: number | null;
          supply_cap?: string | null;
          timestamp: string;
          total_borrow?: string | null;
          total_borrow_apy?: number | null;
          total_borrow_usd?: number | null;
          total_supply?: string | null;
          total_supply_apy?: string | null;
          total_supply_usd?: number | null;
          underlying_address: string;
          underlying_name: string;
          underlying_price?: number | null;
          underlying_symbol: string;
          updated_at: string;
          usd_price?: number | null;
          utilization_rate?: number | null;
        };
        Update: {
          block_number?: number;
          borrow_apy?: number | null;
          borrow_cap?: string | null;
          chain_id?: number;
          collateral_factor?: number | null;
          ctoken_address?: string;
          decimals?: number;
          exchange_rate?: number | null;
          id?: number;
          is_borrow_paused?: boolean | null;
          is_listed?: boolean | null;
          is_mint_paused?: boolean | null;
          pool_address?: string;
          reserve_factor?: number | null;
          reward_apy?: string | null;
          reward_apy_borrow?: string | null;
          reward_apy_supply?: string | null;
          reward_tokens?: string | null;
          supply_apy?: number | null;
          supply_cap?: string | null;
          timestamp?: string;
          total_borrow?: string | null;
          total_borrow_apy?: number | null;
          total_borrow_usd?: number | null;
          total_supply?: string | null;
          total_supply_apy?: string | null;
          total_supply_usd?: number | null;
          underlying_address?: string;
          underlying_name?: string;
          underlying_price?: number | null;
          underlying_symbol?: string;
          updated_at?: string;
          usd_price?: number | null;
          utilization_rate?: number | null;
        };
        Relationships: [];
      };
      asset_total_apy_history: {
        Row: {
          borrowApy: number | null;
          chain_id: number | null;
          created_at: string;
          ctoken_address: string | null;
          id: number;
          supplyApy: number | null;
          totalSupplyApy: number | null;
          underlying_address: string | null;
        };
        Insert: {
          borrowApy?: number | null;
          chain_id?: number | null;
          created_at?: string;
          ctoken_address?: string | null;
          id?: number;
          supplyApy?: number | null;
          totalSupplyApy?: number | null;
          underlying_address?: string | null;
        };
        Update: {
          borrowApy?: number | null;
          chain_id?: number | null;
          created_at?: string;
          ctoken_address?: string | null;
          id?: number;
          supplyApy?: number | null;
          totalSupplyApy?: number | null;
          underlying_address?: string | null;
        };
        Relationships: [];
      };
      'asset-price': {
        Row: {
          chain_id: string | null;
          created_at: string;
          id: number;
          info: Json | null;
          underlying_address: string | null;
        };
        Insert: {
          chain_id?: string | null;
          created_at?: string;
          id?: number;
          info?: Json | null;
          underlying_address?: string | null;
        };
        Update: {
          chain_id?: string | null;
          created_at?: string;
          id?: number;
          info?: Json | null;
          underlying_address?: string | null;
        };
        Relationships: [];
      };
      'asset-price-and-rates': {
        Row: {
          chain_id: string | null;
          created_at: string;
          ctoken_address: string | null;
          id: number;
          info: Json | null;
          underlying_address: string | null;
        };
        Insert: {
          chain_id?: string | null;
          created_at?: string;
          ctoken_address?: string | null;
          id?: number;
          info?: Json | null;
          underlying_address?: string | null;
        };
        Update: {
          chain_id?: string | null;
          created_at?: string;
          ctoken_address?: string | null;
          id?: number;
          info?: Json | null;
          underlying_address?: string | null;
        };
        Relationships: [];
      };
      'asset-price-development': {
        Row: {
          chain_id: string | null;
          created_at: string;
          id: number;
          info: Json | null;
          underlying_address: string | null;
        };
        Insert: {
          chain_id?: string | null;
          created_at?: string;
          id?: number;
          info?: Json | null;
          underlying_address?: string | null;
        };
        Update: {
          chain_id?: string | null;
          created_at?: string;
          id?: number;
          info?: Json | null;
          underlying_address?: string | null;
        };
        Relationships: [];
      };
      'asset-total-apy': {
        Row: {
          borrowApy: string | null;
          chain_id: string | null;
          created_at: string;
          ctoken_address: string | null;
          id: number;
          supplyApy: string | null;
          totalSupplyApy: string | null;
          underlying_address: string | null;
        };
        Insert: {
          borrowApy?: string | null;
          chain_id?: string | null;
          created_at?: string;
          ctoken_address?: string | null;
          id?: number;
          supplyApy?: string | null;
          totalSupplyApy?: string | null;
          underlying_address?: string | null;
        };
        Update: {
          borrowApy?: string | null;
          chain_id?: string | null;
          created_at?: string;
          ctoken_address?: string | null;
          id?: number;
          supplyApy?: string | null;
          totalSupplyApy?: string | null;
          underlying_address?: string | null;
        };
        Relationships: [];
      };
      'asset-total-apy-development': {
        Row: {
          borrowApy: string | null;
          chain_id: string | null;
          created_at: string;
          ctoken_address: string | null;
          id: number;
          supplyApy: string | null;
          totalSupplyApy: string | null;
          underlying_address: string | null;
        };
        Insert: {
          borrowApy?: string | null;
          chain_id?: string | null;
          created_at?: string;
          ctoken_address?: string | null;
          id?: number;
          supplyApy?: string | null;
          totalSupplyApy?: string | null;
          underlying_address?: string | null;
        };
        Update: {
          borrowApy?: string | null;
          chain_id?: string | null;
          created_at?: string;
          ctoken_address?: string | null;
          id?: number;
          supplyApy?: string | null;
          totalSupplyApy?: string | null;
          underlying_address?: string | null;
        };
        Relationships: [];
      };
      'asset-tvl': {
        Row: {
          chain_id: string | null;
          created_at: string;
          ctoken_address: string | null;
          id: number;
          info: Json | null;
          underlying_address: string | null;
        };
        Insert: {
          chain_id?: string | null;
          created_at?: string;
          ctoken_address?: string | null;
          id?: number;
          info?: Json | null;
          underlying_address?: string | null;
        };
        Update: {
          chain_id?: string | null;
          created_at?: string;
          ctoken_address?: string | null;
          id?: number;
          info?: Json | null;
          underlying_address?: string | null;
        };
        Relationships: [];
      };
      'asset-tvl-development': {
        Row: {
          chain_id: string | null;
          created_at: string;
          ctoken_address: string | null;
          id: number;
          info: Json | null;
          underlying_address: string | null;
        };
        Insert: {
          chain_id?: string | null;
          created_at?: string;
          ctoken_address?: string | null;
          id?: number;
          info?: Json | null;
          underlying_address?: string | null;
        };
        Update: {
          chain_id?: string | null;
          created_at?: string;
          ctoken_address?: string | null;
          id?: number;
          info?: Json | null;
          underlying_address?: string | null;
        };
        Relationships: [];
      };
      ionic_users: {
        Row: {
          address: string;
          created_at: string;
        };
        Insert: {
          address: string;
          created_at?: string;
        };
        Update: {
          address?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      ranks: {
        Row: {
          address: string;
          created_at: string;
          points: number | null;
          rank: number | null;
        };
        Insert: {
          address: string;
          created_at?: string;
          points?: number | null;
          rank?: number | null;
        };
        Update: {
          address?: string;
          created_at?: string;
          points?: number | null;
          rank?: number | null;
        };
        Relationships: [];
      };
      ranks_season2: {
        Row: {
          address: string;
          created_at: string;
          points: number | null;
          rank: number | null;
        };
        Insert: {
          address: string;
          created_at?: string;
          points?: number | null;
          rank?: number | null;
        };
        Update: {
          address?: string;
          created_at?: string;
          points?: number | null;
          rank?: number | null;
        };
        Relationships: [];
      };
      saved_chats: {
        Row: {
          created_at: string;
          id: string;
          is_favorite: boolean | null;
          label: string;
          messages: Json;
          prompt: string;
          response: string;
          wallet_address: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          is_favorite?: boolean | null;
          label: string;
          messages: Json;
          prompt: string;
          response: string;
          wallet_address: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_favorite?: boolean | null;
          label?: string;
          messages?: Json;
          prompt?: string;
          response?: string;
          wallet_address?: string;
        };
        Relationships: [];
      };
      test_ionic: {
        Row: {
          chain_id: string | null;
          created_at: string;
          id: number;
          name: string | null;
          total_tvl_native: string | null;
          total_tvl_usd: string | null;
        };
        Insert: {
          chain_id?: string | null;
          created_at?: string;
          id?: number;
          name?: string | null;
          total_tvl_native?: string | null;
          total_tvl_usd?: string | null;
        };
        Update: {
          chain_id?: string | null;
          created_at?: string;
          id?: number;
          name?: string | null;
          total_tvl_native?: string | null;
          total_tvl_usd?: string | null;
        };
        Relationships: [];
      };
      'total-asset-tvl': {
        Row: {
          chain_id: number | null;
          created_at: string;
          id: number;
          total_barrow_usd: number | null;
          total_tvl_native: number | null;
          total_tvl_usd: string | null;
        };
        Insert: {
          chain_id?: number | null;
          created_at?: string;
          id?: number;
          total_barrow_usd?: number | null;
          total_tvl_native?: number | null;
          total_tvl_usd?: string | null;
        };
        Update: {
          chain_id?: number | null;
          created_at?: string;
          id?: number;
          total_barrow_usd?: number | null;
          total_tvl_native?: number | null;
          total_tvl_usd?: string | null;
        };
        Relationships: [];
      };
      'total-asset-tvl-by-pool': {
        Row: {
          chain_id: number | null;
          created_at: string;
          id: number;
          pool_address: string | null;
          total_borrow_usd: string | null;
          total_tvl_native: number | null;
          total_tvl_usd: string | null;
          underlying_name: string | null;
          underlying_symbol: string | null;
        };
        Insert: {
          chain_id?: number | null;
          created_at?: string;
          id?: number;
          pool_address?: string | null;
          total_borrow_usd?: string | null;
          total_tvl_native?: number | null;
          total_tvl_usd?: string | null;
          underlying_name?: string | null;
          underlying_symbol?: string | null;
        };
        Update: {
          chain_id?: number | null;
          created_at?: string;
          id?: number;
          pool_address?: string | null;
          total_borrow_usd?: string | null;
          total_tvl_native?: number | null;
          total_tvl_usd?: string | null;
          underlying_name?: string | null;
          underlying_symbol?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
