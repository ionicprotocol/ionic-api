import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Chain } from '../common/types/chain.type';
import { Address, createPublicClient } from 'viem';
import { MarketId } from '@morpho-org/blue-sdk';
import { getChainConfig, getChainId } from 'src/common/utils/chain.utils';
import { http } from 'viem';
import { AccrualPosition } from '@morpho-org/blue-sdk-viem/lib/augment/Position';
import { Market } from '@morpho-org/blue-sdk-viem/lib/augment/Market';
import { Time } from '@morpho-org/morpho-ts';
import { MarketsResponseDto } from './dto/get-market-info.dto';
import { MarketSearchQueryDto } from './dto/market-search.dto';
import { MARKETS } from './constants/markets';
import { MorphoGraphQLService } from './services/graphql.service';
import { PositionsResponseDto } from '../common/dto/position.dto';

@Injectable()
export class MorphoService {
  private readonly logger = new Logger(MorphoService.name);

  constructor(private readonly graphqlService: MorphoGraphQLService) {}

  async getPositions(
    chain: Chain,
    address: Address,
  ): Promise<PositionsResponseDto> {
    try {
      const chainId = getChainId(chain);
      const data = await this.graphqlService.getUserPositions(address, chainId);
      const user = data.userByAddress;

      if (!user || !user.marketPositions) {
        return { positions: { pools: [] } };
      }

      const pools = user.marketPositions.map((position) => {
        return {
          name: '',
          poolId: position.market.uniqueKey,
          healthFactor: position.healthFactor,
          assets: [
            // collateral
            {
              underlyingSymbol: position.market.collateralAsset.symbol,
              underlyingDecimals: position.market.collateralAsset.decimals,
              supplyBalance: position.collateral,
              supplyBalanceUsd: position.collateralUsd,
              borrowBalance: '0',
              borrowBalanceUsd: '0',
              collateralFactor: position.market.lltv,
              supplyApy: 0,
              borrowApy: 0,
              underlyingPriceUsd: position.market.collateralAsset.priceUsd,
              totalSupply: position.market.state.collateralAssets,
              totalSupplyUsd: position.market.state.collateralAssetsUsd,
              totalBorrow: position.market.state.borrowAssets,
              totalBorrowUsd: position.market.state.borrowAssetsUsd,
              liquidity: position.market.state.liquidityAssets,
              liquidityUsd: position.market.state.liquidityAssetsUsd,
              rewards: position.market.state.rewards.map((reward) => ({
                rewardToken: reward.asset.address,
                rewardSymbol: reward.asset.symbol,
                apy: Number(reward.supplyApr) * 100,
              })),
            },
            // borrow
            {
              underlyingSymbol: position.market.loanAsset.symbol,
              underlyingDecimals: position.market.loanAsset.decimals,
              supplyBalance: '0',
              supplyBalanceUsd: '0',
              borrowBalance: position.borrowAssets,
              borrowBalanceUsd: position.borrowAssetsUsd,
              collateralFactor: position.market.lltv,
              supplyApy: 0,
              borrowApy: Number(position.market.state.borrowApy) * 100,
              underlyingPriceUsd: position.market.loanAsset.priceUsd,
              totalSupply: position.market.state.borrowAssets,
              totalSupplyUsd: position.market.state.borrowAssetsUsd,
              totalBorrow: position.market.state.collateralAssets,
              totalBorrowUsd: position.market.state.collateralAssetsUsd,
              liquidity: position.market.state.liquidityAssets,
              liquidityUsd: position.market.state.liquidityAssetsUsd,
              rewards: position.market.state.rewards.map((reward) => ({
                rewardToken: reward.asset.address,
                rewardSymbol: reward.asset.symbol,
                apy: Number(reward.borrowApr) * 100,
              })),
            },
          ],
        };
      });

      return { positions: { pools } };
    } catch (error) {
      this.logger.error('Failed to fetch positions from GraphQL:', error);
      throw new Error('Failed to fetch positions');
    }
  }

  async getPosition(
    chain: Chain,
    marketId: MarketId,
    address: Address,
  ): Promise<PositionsResponseDto> {
    const chainConfig = getChainConfig(chain);
    const client = createPublicClient({
      chain: chainConfig,
      transport: http(),
    });

    const position = await AccrualPosition.fetch(address, marketId, client);

    if (!position) {
      throw new Error('Position not found');
    }

    // Convert the single position to match the common format
    return {
      positions: {
        pools: [
          {
            name: '',
            poolId: marketId,
            healthFactor: position.healthFactor?.toString() ?? '0',
            assets: [
              {
                underlyingSymbol: '',
                underlyingDecimals: '18',
                supplyBalance: position.supplyAssets?.toString() ?? '0',
                supplyBalanceUsd: '0',
                borrowBalance: position.borrowAssets?.toString() ?? '0',
                borrowBalanceUsd: '0',
                collateralFactor: position.market.params.lltv.toString(),
                supplyApy: 0,
                borrowApy: 0,
                underlyingPriceUsd: position.market.price?.toString() ?? '0',
                totalSupply: position.market.totalSupplyAssets.toString(),
                totalSupplyUsd: '0',
                totalBorrow: position.market.totalBorrowAssets.toString(),
                totalBorrowUsd: '0',
                liquidity: '0',
                liquidityUsd: '0',
                rewards: [],
              },
            ],
          },
        ],
      },
    };
  }

  async getMarketInfo(
    chain: Chain,
    query: MarketSearchQueryDto,
  ): Promise<MarketsResponseDto> {
    const chainMarkets = MARKETS[chain];
    if (!chainMarkets) {
      throw new NotFoundException(`No markets found for chain ${chain}`);
    }

    const filteredMarkets = chainMarkets.filter((m) => {
      if (query.marketId && m.marketId !== query.marketId) {
        return false;
      }
      if (
        query.collateralToken &&
        m.collateralToken !== query.collateralToken
      ) {
        return false;
      }
      if (
        query.collateralTokenSymbol &&
        m.collateralTokenSymbol !== query.collateralTokenSymbol
      ) {
        return false;
      }
      if (query.borrowToken && m.borrowToken !== query.borrowToken) {
        return false;
      }
      if (
        query.borrowTokenSymbol &&
        m.borrowTokenSymbol !== query.borrowTokenSymbol
      ) {
        return false;
      }
      return true;
    });

    const chainConfig = getChainConfig(chain);
    const client = createPublicClient({
      chain: chainConfig,
      transport: http(),
    });

    const marketDataPromises = filteredMarkets.map(async (market) => {
      const marketData = await Market.fetch(market.marketId, client);
      const accruedMarket = marketData.accrueInterest(Time.timestamp());

      return {
        marketId: market.marketId,
        collateralToken: market.collateralToken,
        collateralTokenSymbol: market.collateralTokenSymbol,
        borrowToken: market.borrowToken,
        borrowTokenSymbol: market.borrowTokenSymbol,
        utilization: (marketData.utilization ?? 0n).toString(),
        liquidity: (marketData.liquidity ?? 0n).toString(),
        apyAtTarget: (accruedMarket.apyAtTarget ?? 0n).toString(),
        borrowApy: (accruedMarket.borrowApy ?? 0n).toString(),
        totalSupplyAssets: (accruedMarket.totalSupplyAssets ?? 0n).toString(),
        totalBorrowAssets: (accruedMarket.totalBorrowAssets ?? 0n).toString(),
      };
    });

    const markets = await Promise.all(marketDataPromises);

    return { markets };
  }
}
