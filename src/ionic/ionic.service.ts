import { Injectable, Logger } from '@nestjs/common';
import { Chain } from '../common/types/chain.type';
import { MarketsResponseDto, MarketInfoDto } from './dto/market.dto';
import {
  PoolOperationRequestDto,
  PoolOperationResponseDto,
} from './dto/pool-operations.dto';
import { Address, encodeFunctionData, formatUnits, parseUnits } from 'viem';
import { SupabaseService } from '../common/database/supabase.service';
import { formatDecimal } from 'src/common/utils/number.utils';
import { IonicPoolABI } from './abi/pool';
import { MarketSearchQueryDto } from '../common/dto/market-search.dto';
import { ChainService } from '../common/services/chain.service';
import { ADDRESSES } from './constants/addresses';
import { poolLensAbi } from './abi/poolLens';
import { flywheelLensRouterAbi } from './abi/flywheelLensRouter';
import {
  AssetPositionDto,
  PositionsResponseDto,
} from '../common/dto/position.dto';
import { PriceFeedService } from 'src/common/services/price-feed.service';

function ratePerBlockToAPY(ratePerBlock: bigint, blocksPerMin: number): number {
  const blocksPerDay = blocksPerMin * 60 * 24;
  const rateAsNumber = Number(formatUnits(ratePerBlock, 18));
  return (Math.pow(rateAsNumber * blocksPerDay + 1, 365) - 1) * 100;
}

@Injectable()
export class IonicService {
  private readonly logger = new Logger(IonicService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly chainService: ChainService,
    private readonly priceFeedService: PriceFeedService,
  ) {}

  async getMarketInfo(
    query: MarketSearchQueryDto,
  ): Promise<MarketsResponseDto> {
    const marketData = await this.supabaseService.getAssetMasterData(query);

    const markets: MarketInfoDto[] = marketData.map((data) => ({
      address: data.ctoken_address,
      pool_address: data.pool_address,
      underlying_address: data.underlying_address,
      underlying_name: data.underlying_name,
      underlying_symbol: data.underlying_symbol,
      decimals: data.decimals,
      underlying_price: data.underlying_price ?? 0,
      usd_price: data.usd_price ?? 0,
      exchange_rate: data.exchange_rate ?? 0,
      total_supply: data.total_supply ?? '0',
      total_supply_usd: data.total_supply_usd ?? 0,
      total_borrow: data.total_borrow ?? '0',
      total_borrow_usd: data.total_borrow_usd ?? 0,
      utilization_rate: data.utilization_rate ?? 0,
      supply_apy: data.supply_apy ?? 0,
      borrow_apy: data.borrow_apy ?? 0,
      is_listed: data.is_listed ?? false,
      collateral_factor: data.collateral_factor ?? 0,
      reserve_factor: data.reserve_factor ?? 0,
      borrow_cap: data.borrow_cap ?? '0',
      supply_cap: data.supply_cap ?? '0',
      is_borrow_paused: data.is_borrow_paused ?? false,
      is_mint_paused: data.is_mint_paused ?? false,
      reward_tokens: JSON.parse(data.reward_tokens ?? '[]'),
      reward_apy_borrow: data.reward_apy_borrow?.toString() ?? '0',
      reward_apy_supply: data.reward_apy_supply?.toString() ?? '0',
      total_supply_apy: Number(data.total_supply_apy ?? 0),
      total_borrow_apy: Number(data.total_borrow_apy ?? 0),
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
      positions: { pools: [] },
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
      const ethUsdPrice = await this.priceFeedService.getEthUsdPrice();
      positions.positions.pools.push({
        name: pool.name,
        poolId: pool.comptroller,
        assets: assetsResult.result.map((asset) => {
          const borrowBalanceNative =
            Number(
              formatUnits(
                asset.borrowBalance,
                Number(asset.underlyingDecimals),
              ),
            ) * Number(formatUnits(asset.underlyingPrice, 18));
          const borrowBalanceUsd = borrowBalanceNative * ethUsdPrice;

          const supplyBalanceNative =
            Number(
              formatUnits(
                asset.supplyBalance,
                Number(asset.underlyingDecimals),
              ),
            ) * Number(formatUnits(asset.underlyingPrice, 18));
          const supplyBalanceUsd = supplyBalanceNative * ethUsdPrice;

          const totalSupplyNative =
            Number(
              formatUnits(asset.totalSupply, Number(asset.underlyingDecimals)),
            ) * Number(formatUnits(asset.underlyingPrice, 18));

          const totalSupplyUsd = totalSupplyNative * ethUsdPrice;
          const totalBorrowNative =
            Number(
              formatUnits(asset.totalBorrow, Number(asset.underlyingDecimals)),
            ) * Number(formatUnits(asset.underlyingPrice, 18));
          const totalBorrowUsd = totalBorrowNative * ethUsdPrice;

          const liquidityNative =
            Number(
              formatUnits(asset.liquidity, Number(asset.underlyingDecimals)),
            ) * Number(formatUnits(asset.underlyingPrice, 18));
          const liquidityUsd = liquidityNative * ethUsdPrice;

          return {
            underlyingPriceUsd: formatUnits(asset.underlyingPrice, 18),
            underlyingSymbol: asset.underlyingSymbol,
            underlyingDecimals: asset.underlyingDecimals.toString(),
            underlyingBalance: asset.underlyingBalance.toString(),
            supplyApy: ratePerBlockToAPY(asset.supplyRatePerBlock, 30),
            borrowApy: ratePerBlockToAPY(asset.borrowRatePerBlock, 30),
            totalSupply: asset.totalSupply.toString(),
            totalBorrow: asset.totalBorrow.toString(),
            supplyBalance: asset.supplyBalance.toString(),
            borrowBalance: asset.borrowBalance.toString(),
            liquidity: asset.liquidity.toString(),
            collateralFactor: asset.collateralFactor.toString(),
            reserveFactor: asset.reserveFactor.toString(),
            adminFee: asset.adminFee.toString(),
            ionicFee: asset.ionicFee.toString(),
            borrowBalanceUsd: borrowBalanceUsd.toString(),
            supplyBalanceUsd: supplyBalanceUsd.toString(),
            totalSupplyUsd: totalSupplyUsd.toString(),
            totalBorrowUsd: totalBorrowUsd.toString(),
            liquidityUsd: liquidityUsd.toString(),
            rewards: rewardsInfo
              .find((reward) => reward.market === asset.cToken)
              ?.rewardsInfo.filter((reward) => reward.formattedAPR > 0n)
              .map((reward) => ({
                rewardToken: reward.rewardToken,
                apy: Number(formatUnits(reward.formattedAPR, 18 - 2)),
                rewardSymbol: '',
              })),
          } as AssetPositionDto;
        }),
        healthFactor: healthFactor.toString(),
      });
    }
    return positions;
  }

  async supply(
    chain: Chain,
    request: PoolOperationRequestDto,
  ): Promise<PoolOperationResponseDto> {
    const query: MarketSearchQueryDto = {
      asset: request.call_data.asset,
      chain,
    };
    const marketData = await this.supabaseService.getAssetMasterData(query);

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
    const query: MarketSearchQueryDto = {
      asset: request.call_data.asset,
      chain,
    };
    const marketData = await this.supabaseService.getAssetMasterData(query);

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
    const query: MarketSearchQueryDto = {
      asset: request.call_data.asset,
      chain,
    };
    const marketData = await this.supabaseService.getAssetMasterData(query);

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
    const query: MarketSearchQueryDto = {
      asset: request.call_data.asset,
      chain,
    };
    const marketData = await this.supabaseService.getAssetMasterData(query);

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
