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
        '0x9103c3b4e834476c9a62ea009ba2c884ee42e94e6e314a26f04d312434191836' as MarketId,
      collateralToken: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
      collateralTokenSymbol: 'cbBTC',
      borrowToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      borrowTokenSymbol: 'USDC',
    },
    {
      marketId:
        '0x3a4048c64ba1b375330d376b1ce40e4047d03b47ab4d48af484edec9fec801ba' as MarketId,
      collateralToken: '0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452',
      collateralTokenSymbol: 'wstETH',
      borrowToken: '0x4200000000000000000000000000000000000006',
      borrowTokenSymbol: 'WETH',
    },
    {
      marketId:
        '0x144bf18d6bf4c59602548a825034f73bf1d20177fc5f975fc69d5a5eba929b45' as MarketId,
      collateralToken: '0x7FcD174E80f264448ebeE8c88a7C4476AAF58Ea6',
      collateralTokenSymbol: 'wsuperOETHb',
      borrowToken: '0x4200000000000000000000000000000000000006',
      borrowTokenSymbol: 'WETH',
    },
    {
      marketId:
        '0x7f90d72667171d72d10d62b5828d6a5ef7254b1e33718fe0c1f7dcf56dd1edc7' as MarketId,
      collateralToken: '0xCb327b99fF831bF8223cCEd12B1338FF3aA322Ff',
      collateralTokenSymbol: 'bsdETH',
      borrowToken: '0x4200000000000000000000000000000000000006',
      borrowTokenSymbol: 'WETH',
    },
    {
      marketId:
        '0x30767836635facec1282e6ef4a5981406ed4e72727b3a63a3a72c74e8279a8d7' as MarketId,
      collateralToken: '0xecAc9C5F704e954931349Da37F60E39f515c11c1',
      collateralTokenSymbol: 'LBTC',
      borrowToken: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
      borrowTokenSymbol: 'cbBTC',
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
