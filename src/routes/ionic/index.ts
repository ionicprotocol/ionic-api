import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
dotenv.config();

import { Router } from 'express';
import { 
  createPublicClient, 
  http, 
  parseEther,
  encodeFunctionData,
  Address,
  hexToString,
  createWalletClient,
  custom,
  PublicClient,
  // privateKeyToAccount
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { getChainConfig } from '../../utils/chains';
import { IonicPoolABI } from '../../abis/IonicPool';

const router = Router();

const MAIN_POOL_ADDRESSES = {
  'mode': '0xfb3323e24743caf4add0fdccfb268565c0685556',
  'base': '0x05c9C6417F246600f8f5f49fcA9Ee991bfF73D13', 
  'optimism': '0xaFB4A254D125B0395610fdc8f1D022936c7b166B'
} as const;

type AssetType = keyof typeof MAIN_POOL_ADDRESSES;

// Add this type for the API response
type PoolAddressResponse = {
  underlying_address: string;
  // add other fields if needed
}

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_API_URL || '',
  process.env.SUPABASE_API_KEY || ''
);

// Modify getAssetPoolAddress to use supabase client
async function getAssetPoolAddress(
  chain: keyof typeof MAIN_POOL_ADDRESSES,
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
    
    console.log("New data", data[0].ctoken_address);
    return data[0].ctoken_address;
  } catch (error) {
    console.error('Error fetching pool address:', error);
    throw error;
  }
}

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

// Add helper function to get chain ID
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
    const chainId = getChainId(chain);
    const { account, amount, asset } = req.body;

    if (!asset) {
      throw new Error('Asset type is required');
    }

    const chainConfig = getChainConfig(chain as SupportedChain);
    const publicClient = createPublicClient({
      chain: chainConfig,
      transport: http()
    });

    // Get the pool address
    const poolAddress = await getAssetPoolAddress(
      chain as SupportedChain,
      asset
    );
    console.log("Pool address", poolAddress);

    // First, we need to get the underlying token address
    const { data: assetData, error: assetError } = await supabase
      .from('asset_master_data')
      .select('underlying_address')
      .eq('chain_id', getChainId(chain))
      .eq('underlying_symbol', asset);

    if (assetError) throw assetError;
    if (!assetData || assetData.length === 0) throw new Error('Asset not found');
    
    const underlyingAddress = assetData[0].underlying_address;
    console.log("Underlying address", underlyingAddress);

    // Generate approval transaction data
    const approvalData = encodeFunctionData({
      abi: [{
        name: 'approve',
        type: 'function',
        inputs: [
          { name: 'spender', type: 'address' },
          { name: 'amount', type: 'uint256' }
        ],
        outputs: [{ type: 'bool' }],
        stateMutability: 'nonpayable'
      }],
      functionName: 'approve',
      args: [poolAddress as Address, parseEther(amount)]
    });

    // Prepare approval transaction
    const approvalTx = await publicClient.prepareTransactionRequest({
      account: account as Address,
      to: underlyingAddress as Address,
      data: approvalData,
    });

    // Send approval transaction
    if (!process.env.PRIVATE_KEY) {
      throw new Error('PRIVATE_KEY environment variable is not set');
    }
    const walletAccount = privateKeyToAccount(('0x' + process.env.PRIVATE_KEY) as `0x${string}`);
    const walletClient = createWalletClient({
      account: walletAccount,
      chain: chainConfig,
      transport: http()
    });

    const approvalHash = await walletClient.sendTransaction({
      ...approvalTx,
      account: walletAccount
    } as any);

    // Wait for approval to be mined
    await publicClient.waitForTransactionReceipt({ hash: approvalHash });

    // Add this before the supply transaction
    const balance = await publicClient.readContract({
      address: underlyingAddress as Address,
      abi: [{
        name: 'balanceOf',
        type: 'function',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ type: 'uint256' }],
        stateMutability: 'view'
      }],
      functionName: 'balanceOf',
      args: [account as Address]
    });

    const allowance = await publicClient.readContract({
      address: underlyingAddress as Address,
      abi: [{
        name: 'allowance',
        type: 'function',
        inputs: [
          { name: 'owner', type: 'address' },
          { name: 'spender', type: 'address' }
        ],
        outputs: [{ type: 'uint256' }],
        stateMutability: 'view'
      }],
      functionName: 'allowance',
      args: [account as Address, poolAddress as Address]
    });

    console.log("Balance:", balance.toString());
    console.log("Allowance:", allowance.toString());
    console.log("Amount to supply:", parseEther(amount).toString());

    if (balance < parseEther(amount)) {
      throw new Error('Insufficient balance');
    }

    if (allowance < parseEther(amount)) {
      throw new Error('Insufficient allowance');
    }

    // Now proceed with the supply transaction
    const supplyData = encodeFunctionData({
      abi: IonicPoolABI,
      functionName: 'mint',
      args: [parseEther(amount)]
    });

    const supplyTx = await publicClient.prepareTransactionRequest({
      account: account as Address,
      data: supplyData,
      to: poolAddress as Address
    });

    const transactionHash = await walletClient.sendTransaction({
      ...supplyTx,
      account: walletAccount
    } as any);

    return res.json({
      success: true,
      approvalHash,
      transactionHash,
      transaction: serializeBigInts(supplyTx)
    });
  } catch (error: any) {
    console.error('Supply error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Withdraw endpoint
router.post('/beta/v0/ionic/withdraw/:chain', async (req, res) => {
  try {
    const { chain } = req.params;
    const chainId = getChainId(chain);
    const { account, amount, to } = req.body;

    const chainConfig = getChainConfig(chain as SupportedChain);
    const publicClient = createPublicClient({
      chain: chainConfig,
      transport: http()
    });

    const data = encodeFunctionData({
      abi: IonicPoolABI,
      functionName: 'redeemUnderlying',
      args: [parseEther(amount)]
    });

    const tx = await publicClient.prepareTransactionRequest({
      account: account as Address,
      data,
      to: to as Address
    });

    if (!process.env.PRIVATE_KEY) {
      throw new Error('PRIVATE_KEY environment variable is not set');
    }
    const walletAccount = privateKeyToAccount(('0x' + process.env.PRIVATE_KEY) as `0x${string}`)
    const walletClient = createWalletClient({
      account: walletAccount,
      chain: chainConfig,
      transport: http()
    });

    const hash = await walletClient.sendTransaction({
      ...tx,
      account: walletAccount
    } as any);

    return res.json({
      success: true,
      transaction: serializeBigInts(tx),
      transactionHash: hash
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
    const chainId = getChainId(chain);
    const { account, amount, to } = req.body;

    const chainConfig = getChainConfig(chain as SupportedChain);
    const publicClient = createPublicClient({
      chain: chainConfig,
      transport: http()
    });

    const data = encodeFunctionData({
      abi: IonicPoolABI,
      functionName: 'borrow',
      args: [parseEther(amount)]
    });

    const tx = await publicClient.prepareTransactionRequest({
      account: account as Address,
      data,
      to: to as Address
    });

    if (!process.env.PRIVATE_KEY) {
      throw new Error('PRIVATE_KEY environment variable is not set');
    }
    const walletAccount = privateKeyToAccount(('0x' + process.env.PRIVATE_KEY) as `0x${string}`)
    const walletClient = createWalletClient({
      account: walletAccount,
      chain: chainConfig,
      transport: http()
    });

    const hash = await walletClient.sendTransaction({
      ...tx,
      account: walletAccount
    } as any);

    return res.json({
      success: true,
      transaction: serializeBigInts(tx),
      transactionHash: hash
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
    const chainId = getChainId(chain);
    const { account, amount, to } = req.body;

    const chainConfig = getChainConfig(chain as SupportedChain);
    const publicClient = createPublicClient({
      chain: chainConfig,
      transport: http()
    });

    const data = encodeFunctionData({
      abi: IonicPoolABI,
      functionName: 'repayBorrow',
      args: [parseEther(amount)]
    });

    const tx = await publicClient.prepareTransactionRequest({
      account: account as Address,
      data,
      to: to as Address
    });

    if (!process.env.PRIVATE_KEY) {
      throw new Error('PRIVATE_KEY environment variable is not set');
    }
    const walletAccount = privateKeyToAccount(('0x' + process.env.PRIVATE_KEY) as `0x${string}`)
    const walletClient = createWalletClient({
      account: walletAccount,
      chain: chainConfig,
      transport: http()
    });

    const hash = await walletClient.sendTransaction({
      ...tx,
      account: walletAccount
    } as any);

    return res.json({
      success: true,
      transaction: serializeBigInts(tx),
      transactionHash: hash
    });
  } catch (error: any) {
    console.error('Repay error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Add this new endpoint
router.get('/beta/v0/ionic/pool-address/:chain/:asset', async (req, res) => {
  try {
    const { chain, asset } = req.params;
    const chainId = getChainId(chain);
    
    const chainConfig = getChainConfig(chain as SupportedChain);
    const publicClient = createPublicClient({
      chain: chainConfig,
      transport: http()
    });

    const poolAddress = await getAssetPoolAddress(
      chain as keyof typeof MAIN_POOL_ADDRESSES,
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