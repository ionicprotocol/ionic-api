import { Router } from 'express';
import { 
  createPublicClient, 
  http, 
  parseEther,
  encodeFunctionData,
  Address
} from 'viem';
import { getChainConfig } from '../../utils/chains';
import { IonicPoolABI } from '../../abis/IonicPool';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

type SupportedChain = "optimism" | "base" | "mode";

// Helper function to convert BigInt values to strings recursively
const serializeBigInts = (obj: any): any => {
  if (typeof obj === 'bigint') {
    return obj.toString();
  }
  if (Array.isArray(obj)) {
    return obj.map(serializeBigInts);
  }
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, serializeBigInts(value)])
    );
  }
  return obj;
};

// Initialize Supabase client
if (!process.env.SUPABASE_API_URL) {
  throw new Error('SUPABASE_API_URL environment variable is required');
}
if (!process.env.SUPABASE_API_KEY) {
  throw new Error('SUPABASE_API_KEY environment variable is required'); 
}

const supabase = createClient(
  process.env.SUPABASE_API_URL,
  process.env.SUPABASE_API_KEY
);

// Add helper function to get pool address
async function getAssetPoolAddress(
  chain: SupportedChain,
  asset: string,
): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('asset_master_data')
      .select('ctoken_address')
      .eq('chain_id', getChainId(chain))
      .eq('underlying_symbol', asset);

    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Pool not found');
    console.log(data[0].ctoken_address);
    return data[0].ctoken_address;
  } catch (error) {
    console.error('Error fetching pool address:', error);
    throw error;
  }
}

// Add chain ID helper
function getChainId(chain: string): number {
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
    case 'ozeantest':
      return 7849306;
    case 'camptest':
      return 325000;
    default:
      throw new Error(`Unsupported chain: ${chain}`);
  }
}

// Supply endpoint
router.post('/beta/v0/ionic/supply/:chain', async (req, res) => {
  try {
    const { chain } = req.params;
    const { account, amount, asset } = req.body;

    if (!asset) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing 'asset' parameter" 
      });
    }

    const chainConfig = getChainConfig(chain as SupportedChain);
    const publicClient = createPublicClient({
      chain: chainConfig,
      transport: http()
    });

    const poolAddress = await getAssetPoolAddress(
      chain as SupportedChain,
      asset
    );

    const data = encodeFunctionData({
      abi: IonicPoolABI,
      functionName: 'mint',
      args: [parseEther(amount)] as const
    });

    // Return just the transaction request data
    return res.json({
      success: true,
      transactionRequest: {
        to: poolAddress,
        data,
        from: account,
      }
    });
  } catch (error: any) {
    console.error('Supply error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Withdraw endpoint
router.post('/beta/v0/ionic/withdraw/:chain', async (req, res) => {
  try {
    const { chain } = req.params;
    const { account, amount, asset } = req.body;

    const poolAddress = await getAssetPoolAddress(
      chain as SupportedChain,
      asset
    );

    const data = encodeFunctionData({
      abi: IonicPoolABI,
      functionName: 'redeemUnderlying',
      args: [parseEther(amount)]
    });

    return res.json({
      success: true,
      transactionRequest: {
        to: poolAddress,
        data,
        from: account,
      }
    });
  } catch (error: any) {
    console.error('Withdraw error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Borrow endpoint
router.post('/beta/v0/ionic/borrow/:chain', async (req, res) => {
  try {
    const { chain } = req.params;
    const { account, amount, asset } = req.body;

    const poolAddress = await getAssetPoolAddress(
      chain as SupportedChain,
      asset
    );

    const data = encodeFunctionData({
      abi: IonicPoolABI,
      functionName: 'borrow',
      args: [parseEther(amount)]
    });

    return res.json({
      success: true,
      transactionRequest: {
        to: poolAddress,
        data,
        from: account,
      }
    });
  } catch (error: any) {
    console.error('Borrow error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Repay endpoint
router.post('/beta/v0/ionic/repay/:chain', async (req, res) => {
  try {
    const { chain } = req.params;
    const { account, amount, asset } = req.body;

    const poolAddress = await getAssetPoolAddress(
      chain as SupportedChain,
      asset
    );

    const data = encodeFunctionData({
      abi: IonicPoolABI,
      functionName: 'repayBorrow',
      args: [parseEther(amount)]
    });

    return res.json({
      success: true,
      transactionRequest: {
        to: poolAddress,
        data,
        from: account,
        value: chain.toLowerCase() === 'mode' ? parseEther(amount) : undefined
      }
    });
  } catch (error: any) {
    console.error('Repay error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Pool address endpoint
router.get('/beta/v0/ionic/pool-address/:chain/:asset', async (req, res) => {
  try {
    const { chain, asset } = req.params;
    
    const poolAddress = await getAssetPoolAddress(
      chain as SupportedChain,
      asset
    );

    return res.json({
      success: true,
      poolAddress
    });
  } catch (error: any) {
    console.error('Get pool address error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;