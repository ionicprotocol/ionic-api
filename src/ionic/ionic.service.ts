import { Injectable } from '@nestjs/common';
import { Chain } from '../common/types/chain.type';
import { getChainConfig } from '../common/utils/chain.utils';
import { MarketAddressResponseDto } from './dto/market.dto';
import {
  PoolOperationRequestDto,
  PoolOperationResponseDto,
} from './dto/pool-operations.dto';
import {
  Address,
  createPublicClient,
  encodeFunctionData,
  http,
  parseUnits,
} from 'viem';
import { SupabaseService } from '../common/database/supabase.service';
import { formatDecimal } from 'src/common/utils/number.utils';
import { IonicPoolABI } from './abi/ionicPool';

@Injectable()
export class IonicService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getMarketInfo(
    chain: Chain,
    asset: string,
  ): Promise<MarketAddressResponseDto> {
    const marketData = await this.supabaseService.getAssetMasterData(
      chain,
      asset,
    );

    if (!marketData) {
      throw new Error(`Market not found for ${asset} on ${chain}`);
    }

    return {
      address: marketData.ctoken_address,
      pool_address: marketData.pool_address,
      underlying_address: marketData.underlying_address,
      underlying_name: marketData.underlying_name,
      underlying_symbol: marketData.underlying_symbol,
      decimals: marketData.decimals,
      supply_apy: marketData.supply_apy,
      borrow_apy: marketData.borrow_apy,
      total_supply: marketData.total_supply,
      total_borrow: marketData.total_borrow,
      utilization_rate: marketData.utilization_rate,
      is_listed: marketData.is_listed,
      is_borrow_paused: marketData.is_borrow_paused,
      is_mint_paused: marketData.is_mint_paused,
    };
  }

  async supply(
    chain: Chain,
    { call_data, sender }: PoolOperationRequestDto,
  ): Promise<PoolOperationResponseDto> {
    const chainConfig = getChainConfig(chain);
    const publicClient = createPublicClient({
      chain: chainConfig,
      transport: http(),
    });

    const poolInfo = await this.supabaseService.getAssetMasterData(
      chain,
      call_data.asset,
    );

    if (!poolInfo) {
      throw new Error(`Market not found for ${call_data.asset} on ${chain}`);
    }

    const formattedAmount = formatDecimal(call_data.amount);
    const amountInWei = parseUnits(formattedAmount, poolInfo.decimals);

    const data = encodeFunctionData({
      abi: IonicPoolABI,
      functionName: 'mint',
      args: [amountInWei] as const,
    });

    const nonce = await publicClient.getTransactionCount({
      address: sender as Address,
    });
    const feeData = await publicClient.estimateFeesPerGas();

    return {
      chainId: chainConfig.id,
      data,
      from: sender,
      to: poolInfo.pool_address,
      value: 0,
      nonce: Number(nonce),
      maxFeePerGas: Number(feeData?.maxFeePerGas || 0),
      maxPriorityFeePerGas: Number(feeData?.maxPriorityFeePerGas || 0),
    };
  }

  async withdraw(
    chain: Chain,
    { call_data, sender }: PoolOperationRequestDto,
  ): Promise<PoolOperationResponseDto> {
    const chainConfig = getChainConfig(chain);
    const publicClient = createPublicClient({
      chain: chainConfig,
      transport: http(),
    });

    const poolInfo = await this.supabaseService.getAssetMasterData(
      chain,
      call_data.asset,
    );

    if (!poolInfo) {
      throw new Error(`Market not found for ${call_data.asset} on ${chain}`);
    }

    const formattedAmount = formatDecimal(call_data.amount);
    const amountInWei = parseUnits(formattedAmount, poolInfo.decimals);

    const data = encodeFunctionData({
      abi: IonicPoolABI,
      functionName: 'redeem',
      args: [amountInWei] as const,
    });

    const nonce = await publicClient.getTransactionCount({
      address: sender as Address,
    });
    const feeData = await publicClient.estimateFeesPerGas();

    return {
      chainId: chainConfig.id,
      data,
      from: sender,
      to: poolInfo.pool_address,
      value: 0,
      nonce: Number(nonce),
      maxFeePerGas: Number(feeData?.maxFeePerGas || 0),
      maxPriorityFeePerGas: Number(feeData?.maxPriorityFeePerGas || 0),
    };
  }

  async borrow(
    chain: Chain,
    { call_data, sender }: PoolOperationRequestDto,
  ): Promise<PoolOperationResponseDto> {
    const chainConfig = getChainConfig(chain);
    const publicClient = createPublicClient({
      chain: chainConfig,
      transport: http(),
    });

    const poolInfo = await this.supabaseService.getAssetMasterData(
      chain,
      call_data.asset,
    );

    if (!poolInfo) {
      throw new Error(`Market not found for ${call_data.asset} on ${chain}`);
    }

    const formattedAmount = formatDecimal(call_data.amount);
    const amountInWei = parseUnits(formattedAmount, poolInfo.decimals);

    const data = encodeFunctionData({
      abi: IonicPoolABI,
      functionName: 'borrow',
      args: [amountInWei] as const,
    });

    const nonce = await publicClient.getTransactionCount({
      address: sender as Address,
    });
    const feeData = await publicClient.estimateFeesPerGas();

    return {
      chainId: chainConfig.id,
      data,
      from: sender,
      to: poolInfo.pool_address,
      value: 0,
      nonce: Number(nonce),
      maxFeePerGas: Number(feeData?.maxFeePerGas || 0),
      maxPriorityFeePerGas: Number(feeData?.maxPriorityFeePerGas || 0),
    };
  }

  async repay(
    chain: Chain,
    { call_data, sender }: PoolOperationRequestDto,
  ): Promise<PoolOperationResponseDto> {
    const chainConfig = getChainConfig(chain);
    const publicClient = createPublicClient({
      chain: chainConfig,
      transport: http(),
    });

    const poolInfo = await this.supabaseService.getAssetMasterData(
      chain,
      call_data.asset,
    );

    if (!poolInfo) {
      throw new Error(`Market not found for ${call_data.asset} on ${chain}`);
    }

    const formattedAmount = formatDecimal(call_data.amount);
    const amountInWei = parseUnits(formattedAmount, poolInfo.decimals);

    const data = encodeFunctionData({
      abi: IonicPoolABI,
      functionName: 'repayBorrow',
      args: [amountInWei] as const,
    });

    const nonce = await publicClient.getTransactionCount({
      address: sender as Address,
    });
    const feeData = await publicClient.estimateFeesPerGas();

    return {
      chainId: chainConfig.id,
      data,
      from: sender,
      to: poolInfo.pool_address,
      value: 0,
      nonce: Number(nonce),
      maxFeePerGas: Number(feeData?.maxFeePerGas || 0),
      maxPriorityFeePerGas: Number(feeData?.maxPriorityFeePerGas || 0),
    };
  }
}
