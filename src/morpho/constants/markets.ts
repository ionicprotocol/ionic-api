import { Chain } from '../../common/types/chain.type';
import { MarketId } from '@morpho-org/blue-sdk';
import { Address } from 'viem';

export interface MarketInfo {
  marketId: MarketId;
  collateralToken: Address;
  collateralTokenSymbol: string;
  borrowToken: Address;
  borrowTokenSymbol: string;
}

export const MARKETS: Record<Chain, MarketInfo[]> = {
  base: [
    {
      marketId:
        '0x144bf18d6bf4c59602548a825034f73bf1d20177fc5f975fc69d5a5eba929b45' as MarketId,
      collateralToken: '0x7FcD174E80f264448ebeE8c88a7C4476AAF58Ea6',
      collateralTokenSymbol: 'wsuperOETHb',
      borrowToken: '0x4200000000000000000000000000000000000006',
      borrowTokenSymbol: 'WETH',
    },
  ],
  optimism: [],
  mode: [],
  bob: [],
  fraxtal: [],
  lisk: [],
  ink: [],
  superseed: [],
  worldchain: [],
  swell: [],
  soneium: [],
};
