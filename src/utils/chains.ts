import { 
  mainnet, 
  polygon, 
  arbitrum,
  optimism,
  base,
  mode,
  // Import other chains as needed
} from 'viem/chains';

const CHAIN_CONFIGS = {
  optimism: optimism,
  base: base,
  mode: mode,
  // Add other chains as needed
};

type SupportedChain = keyof typeof CHAIN_CONFIGS;

export function getChainConfig(chain: SupportedChain) {
  const config = CHAIN_CONFIGS[chain];
  if (!config) {
    throw new Error(`Unsupported chain: ${chain}`);
  }
  return config;
} 