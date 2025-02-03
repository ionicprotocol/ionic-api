export interface AssetPosition {
  underlyingSymbol: string;
  underlyingDecimals: string;
  supplyBalance: string | bigint;
  supplyBalanceUsd: string | number;
  borrowBalance: string | bigint;
  borrowBalanceUsd: string | number;
  collateralFactor: string;
  supplyApy: string | number;
  borrowApy: string | number;
  underlyingPriceUsd: string;
  totalSupply: string;
  totalSupplyUsd: string;
  totalBorrow: string;
  totalBorrowUsd: string;
  liquidity: string;
  liquidityUsd: string;
  rewards: {
    rewardToken: string;
    rewardSymbol: string;
    apy: string;
  }[];
}

export interface PoolPosition {
  name: string;
  poolId: string;
  healthFactor: string;
  assets: AssetPosition[];
}

export interface PositionsResponse {
  positions: {
    pools: PoolPosition[];
  };
}
