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
