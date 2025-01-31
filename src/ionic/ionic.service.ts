import { Injectable, Logger } from '@nestjs/common';
import { Chain } from '../common/types/chain.type';
import { MarketsResponseDto, MarketInfoDto } from './dto/market.dto';
import {
  PoolOperationRequestDto,
  PoolOperationResponseDto,
} from './dto/pool-operations.dto';
import { Address, encodeFunctionData, parseUnits } from 'viem';
import { SupabaseService } from '../common/database/supabase.service';
import { formatDecimal } from 'src/common/utils/number.utils';
import { IonicPoolABI } from './abi/pool';
import { MarketSearchQueryDto } from './dto/market-search.dto';
import { ChainService } from '../common/services/chain.service';
import { PositionsResponseDto } from './dto/position.dto';
import { ADDRESSES } from './constants/addresses';
import { poolLensAbi } from './abi/poolLens';
import { flywheelLensRouterAbi } from './abi/flywheelLensRouter';

@Injectable()
export class IonicService {
  private readonly logger = new Logger(IonicService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly chainService: ChainService,
  ) {}

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

  async getPositions(
    chain: Chain,
    address: Address,
  ): Promise<PositionsResponseDto> {
    const publicClient = this.chainService.getPublicClient(chain);
    const chainId = this.chainService.getChainId(chain);
    const poolLensAddress = ADDRESSES[chainId].poolLens;
    const flywheelLensRouterAddress = ADDRESSES[chainId].flywheelLensRouter;
    if (!flywheelLensRouterAddress || !poolLensAddress) {
      throw new Error('Pool lens or flywheel lens router not found');
    }
    const result = await publicClient.simulateContract({
      address: poolLensAddress,
      abi: poolLensAbi,
      functionName: 'getPublicPoolsWithData',
    });
    if (!result.result) {
      throw new Error('Failed to get public pools');
    }
    const [, pools] = result.result;
    console.log('🚀 ~ IonicService ~ pools:', pools);
    const positions: PositionsResponseDto = {
      pools: [],
    };
    for (const pool of pools) {
      let healthFactor = 0n;
      try {
        healthFactor = await publicClient.readContract({
          address: poolLensAddress,
          abi: poolLensAbi,
          functionName: 'getHealthFactor',
          args: [address, pool.comptroller],
        });
      } catch (error) {
        this.logger.error('Error getting health factor:', error);
      }
      const assetsResult = await publicClient.simulateContract({
        address: poolLensAddress,
        abi: poolLensAbi,
        functionName: 'getPoolAssetsByUser',
        args: [pool.comptroller, address],
      });
      if (!assetsResult.result) {
        throw new Error('Failed to get pool assets');
      }
      const rewardsInfoResult = await publicClient.simulateContract({
        address: flywheelLensRouterAddress,
        abi: flywheelLensRouterAbi,
        functionName: 'getPoolMarketRewardsInfo',
        args: [pool.comptroller],
      });
      if (!rewardsInfoResult.result) {
        throw new Error('Failed to get pool rewards info');
      }
      const rewardsInfo = rewardsInfoResult.result;
      const serializedAssets = assetsResult.result.map((asset) => ({
        ...asset,
        underlyingDecimals: asset.underlyingDecimals.toString(),
        underlyingBalance: asset.underlyingBalance.toString(),
        supplyRatePerBlock: asset.supplyRatePerBlock.toString(),
        borrowRatePerBlock: asset.borrowRatePerBlock.toString(),
        totalSupply: asset.totalSupply.toString(),
        totalBorrow: asset.totalBorrow.toString(),
        supplyBalance: asset.supplyBalance.toString(),
        borrowBalance: asset.borrowBalance.toString(),
        liquidity: asset.liquidity.toString(),
        exchangeRate: asset.exchangeRate.toString(),
        underlyingPrice: asset.underlyingPrice.toString(),
        collateralFactor: asset.collateralFactor.toString(),
        reserveFactor: asset.reserveFactor.toString(),
        adminFee: asset.adminFee.toString(),
        ionicFee: asset.ionicFee.toString(),
        rewards: rewardsInfo
          .find((reward) => reward.market === asset.cToken)
          ?.rewardsInfo.filter((reward) => reward.formattedAPR > 0n)
          .map((reward) => ({
            rewardToken: reward.rewardToken,
            apy: reward.formattedAPR.toString(),
          })),
      }));
      positions.pools.push({
        name: pool.name,
        comptroller: pool.comptroller,
        assets: serializedAssets,
        healthFactor: healthFactor.toString(),
      });
    }
    return positions;
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

    const publicClient = this.chainService.getPublicClient(chain);
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
      chainId: this.chainService.getChainId(chain),
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

    const publicClient = this.chainService.getPublicClient(chain);
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
      chainId: this.chainService.getChainId(chain),
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

    const publicClient = this.chainService.getPublicClient(chain);
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
      chainId: this.chainService.getChainId(chain),
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

    const publicClient = this.chainService.getPublicClient(chain);
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
      chainId: this.chainService.getChainId(chain),
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
