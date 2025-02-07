interface Asset {
  address: string;
  name: string;
  symbol: string;
  decimals: string;
  priceUsd: string;
}

interface RewardAsset {
  address: string;
  decimals: string;
  priceUsd: string;
  symbol: string;
}

interface Reward {
  asset: RewardAsset;
  borrowApr: string;
  supplyApr: string;
}

interface MarketState {
  liquidityAssets: string;
  liquidityAssetsUsd: string;
  borrowApy: string;
  borrowAssets: string;
  borrowAssetsUsd: string;
  collateralAssetsUsd: string;
  collateralAssets: string;
  utilization: string;
  supplyApy: string;
  supplyAssets: string;
  supplyAssetsUsd: string;
  rewards: Reward[];
}

interface Market {
  collateralAsset: Asset;
  loanAsset: Asset;
  uniqueKey: string;
  lltv: string;
  state: MarketState;
}

interface MarketPosition {
  borrowAssets: string;
  borrowAssetsUsd: string;
  collateral: string;
  collateralUsd: string;
  healthFactor: string;
  supplyAssetsUsd: string;
  supplyAssets: string;
  market: Market;
}

interface User {
  address: string;
  marketPositions: MarketPosition[];
}

export interface MorphoGraphQLResponse {
  userByAddress: User;
}

// Market query types
export interface MarketQueryItem {
  collateralAsset: {
    address: string;
    symbol: string;
    priceUsd: string;
  };
  loanAsset: {
    address: string;
    symbol: string;
    priceUsd: string;
  };
  lltv: string;
  state: {
    borrowApy: string;
    borrowAssets: string;
    borrowAssetsUsd: string;
    collateralAssets: string;
    collateralAssetsUsd: string;
    supplyApy: string;
    supplyAssets: string;
    supplyAssetsUsd: string;
    utilization: string;
    liquidityAssets: string;
    liquidityAssetsUsd: string;
    rewards: {
      asset: {
        address: string;
        symbol: string;
        priceUsd: string;
      };
      supplyApr: string;
      borrowApr: string;
    }[];
  };
  uniqueKey: string;
}

export interface MarketQueryResponse {
  markets: {
    items: MarketQueryItem[];
  };
}
