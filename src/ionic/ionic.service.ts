import { Injectable } from '@nestjs/common';
import { Chain } from '../common/types/chain.type';
import { getChainConfig } from '../common/utils/chain.utils';
import { MarketsResponseDto, MarketInfoDto } from './dto/market.dto';
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
import { MarketSearchQueryDto } from './dto/market-search.dto';

@Injectable()
export class IonicService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getMarketInfo(
    chain: Chain,
    query: MarketSearchQueryDto,
  ): Promise<MarketsResponseDto> {
    const marketData = await this.supabaseService.getAssetMasterData(
      chain,
      query,
    );

    const markets: MarketInfoDto[] = marketData.map((data) => ({
      address: data.ctoken_address,
      pool_address: data.pool_address,
      underlying_address: data.underlying_address,
      underlying_name: data.underlying_name,
      underlying_symbol: data.underlying_symbol,
      decimals: data.decimals,
      supply_apy: data.supply_apy,
      borrow_apy: data.borrow_apy,
      total_supply: data.total_supply,
      total_borrow: data.total_borrow,
      utilization_rate: data.utilization_rate,
      is_listed: data.is_listed,
      is_borrow_paused: data.is_borrow_paused,
      is_mint_paused: data.is_mint_paused,
    }));

    return { markets };
  }

  async supply(
    chain: Chain,
    request: PoolOperationRequestDto,
  ): Promise<PoolOperationResponseDto> {
    const query: MarketSearchQueryDto = { asset: request.call_data.asset };
    const marketData = await this.supabaseService.getAssetMasterData(
      chain,
      query,
    );

    if (!marketData.length) {
      throw new Error(
        `Market not found for ${request.call_data.asset} on ${chain}`,
      );
    }

    const chainConfig = getChainConfig(chain);
    const publicClient = createPublicClient({
      chain: chainConfig,
      transport: http(),
    });

    const poolInfo = marketData[0];

    const formattedAmount = formatDecimal(request.call_data.amount);
    const amountInWei = parseUnits(formattedAmount, poolInfo.decimals);

    const data = encodeFunctionData({
      abi: IonicPoolABI,
      functionName: 'mint',
      args: [amountInWei] as const,
    });

    const nonce = await publicClient.getTransactionCount({
      address: request.sender as Address,
    });
    const feeData = await publicClient.estimateFeesPerGas();

    return {
      chainId: chainConfig.id,
      data,
      from: request.sender,
      to: poolInfo.pool_address,
      value: 0,
      nonce: Number(nonce),
      maxFeePerGas: Number(feeData?.maxFeePerGas || 0),
      maxPriorityFeePerGas: Number(feeData?.maxPriorityFeePerGas || 0),
    };
  }

  async withdraw(
    chain: Chain,
    request: PoolOperationRequestDto,
  ): Promise<PoolOperationResponseDto> {
    const query: MarketSearchQueryDto = { asset: request.call_data.asset };
    const marketData = await this.supabaseService.getAssetMasterData(
      chain,
      query,
    );

    if (!marketData.length) {
      throw new Error(
        `Market not found for ${request.call_data.asset} on ${chain}`,
      );
    }

    const chainConfig = getChainConfig(chain);
    const publicClient = createPublicClient({
      chain: chainConfig,
      transport: http(),
    });

    const poolInfo = marketData[0];

    const formattedAmount = formatDecimal(request.call_data.amount);
    const amountInWei = parseUnits(formattedAmount, poolInfo.decimals);

    const data = encodeFunctionData({
      abi: IonicPoolABI,
      functionName: 'redeem',
      args: [amountInWei] as const,
    });

    const nonce = await publicClient.getTransactionCount({
      address: request.sender as Address,
    });
    const feeData = await publicClient.estimateFeesPerGas();

    return {
      chainId: chainConfig.id,
      data,
      from: request.sender,
      to: poolInfo.pool_address,
      value: 0,
      nonce: Number(nonce),
      maxFeePerGas: Number(feeData?.maxFeePerGas || 0),
      maxPriorityFeePerGas: Number(feeData?.maxPriorityFeePerGas || 0),
    };
  }

  async borrow(
    chain: Chain,
    request: PoolOperationRequestDto,
  ): Promise<PoolOperationResponseDto> {
    const query: MarketSearchQueryDto = { asset: request.call_data.asset };
    const marketData = await this.supabaseService.getAssetMasterData(
      chain,
      query,
    );

    if (!marketData.length) {
      throw new Error(
        `Market not found for ${request.call_data.asset} on ${chain}`,
      );
    }

    const chainConfig = getChainConfig(chain);
    const publicClient = createPublicClient({
      chain: chainConfig,
      transport: http(),
    });

    const poolInfo = marketData[0];

    const formattedAmount = formatDecimal(request.call_data.amount);
    const amountInWei = parseUnits(formattedAmount, poolInfo.decimals);

    const data = encodeFunctionData({
      abi: IonicPoolABI,
      functionName: 'borrow',
      args: [amountInWei] as const,
    });

    const nonce = await publicClient.getTransactionCount({
      address: request.sender as Address,
    });
    const feeData = await publicClient.estimateFeesPerGas();

    return {
      chainId: chainConfig.id,
      data,
      from: request.sender,
      to: poolInfo.pool_address,
      value: 0,
      nonce: Number(nonce),
      maxFeePerGas: Number(feeData?.maxFeePerGas || 0),
      maxPriorityFeePerGas: Number(feeData?.maxPriorityFeePerGas || 0),
    };
  }

  async repay(
    chain: Chain,
    request: PoolOperationRequestDto,
  ): Promise<PoolOperationResponseDto> {
    const query: MarketSearchQueryDto = { asset: request.call_data.asset };
    const marketData = await this.supabaseService.getAssetMasterData(
      chain,
      query,
    );

    if (!marketData.length) {
      throw new Error(
        `Market not found for ${request.call_data.asset} on ${chain}`,
      );
    }

    const chainConfig = getChainConfig(chain);
    const publicClient = createPublicClient({
      chain: chainConfig,
      transport: http(),
    });

    const poolInfo = marketData[0];

    const formattedAmount = formatDecimal(request.call_data.amount);
    const amountInWei = parseUnits(formattedAmount, poolInfo.decimals);

    const data = encodeFunctionData({
      abi: IonicPoolABI,
      functionName: 'repayBorrow',
      args: [amountInWei] as const,
    });

    const nonce = await publicClient.getTransactionCount({
      address: request.sender as Address,
    });
    const feeData = await publicClient.estimateFeesPerGas();

    return {
      chainId: chainConfig.id,
      data,
      from: request.sender,
      to: poolInfo.pool_address,
      value: 0,
      nonce: Number(nonce),
      maxFeePerGas: Number(feeData?.maxFeePerGas || 0),
      maxPriorityFeePerGas: Number(feeData?.maxPriorityFeePerGas || 0),
    };
  }
}
