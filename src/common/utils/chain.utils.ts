import {
  Chain as ViemChain,
  base,
  bob,
  fraxtal,
  ink,
  lisk,
  mode,
  optimism,
  superseed,
  worldchain,
} from 'viem/chains';
import { Chain } from '../types/chain.type';
import { defineChain } from 'viem';

export type SupportedChain = Chain;

export const CHAIN_CONFIGS: Record<SupportedChain, ViemChain> = {
  optimism,
  base,
  mode,
  bob,
  fraxtal,
  lisk,
  ink,
  superseed,
  worldchain,
  swell: defineChain({
    id: 1923, // replace with actual chain ID
    name: 'Swellchain',
    network: 'swell',
    nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: {
        http: [
          'https://rpc.ankr.com/swell',
          'https://swell-mainnet.alt.technology',
        ],
      },
    },
  }),
  soneium: defineChain({
    id: 1868, // replace with actual chain ID
    name: 'Soneium',
    network: 'soneium',
    nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: {
        http: [
          'https://soneium.rpc.scs.startale.com?apikey=hnUFGYMhADAQ3hFfZ6zIjEbKb6KjoBAq',
        ],
      },
    },
  }),
  // Add other chain configs as needed
};

export function getChainConfig(chain: SupportedChain): ViemChain {
  const config = CHAIN_CONFIGS[chain];
  if (!config) {
    throw new Error(`Unsupported chain: ${chain}`);
  }
  return config;
}

export function getChainId(chain: string): number {
  switch (chain.toLowerCase()) {
    case 'mode':
      return 34443;
    case 'base':
      return 8453;
    case 'optimism':
      return 10;
    case 'bob':
      return 60808;
    case 'fraxtal':
      return 252;
    case 'lisk':
      return 1135;
    case 'ink':
      return 57073;
    case 'superseed':
      return 5330;
    case 'worldchain':
      return 480;
    case 'swell':
      return 1923;
    case 'soneium':
      return 1868;
    // Add any other chains you need
    default:
      throw new Error(`Unsupported chain: ${chain}`);
  }
}
