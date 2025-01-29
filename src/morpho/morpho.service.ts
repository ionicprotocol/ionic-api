import { Injectable, NotFoundException } from '@nestjs/common';
import { Chain } from '../common/types/chain.type';
import { PositionResponseDto } from './dto/get-position.dto';
import { Address, createPublicClient } from 'viem';
import { MarketId } from '@morpho-org/blue-sdk';
import { getChainConfig } from 'src/common/utils/chain.utils';
import { http } from 'viem';
import { AccrualPosition } from '@morpho-org/blue-sdk-viem/lib/augment/Position';
import { Market } from '@morpho-org/blue-sdk-viem/lib/augment/Market';
import { Time } from '@morpho-org/morpho-ts';
import { MarketsResponseDto } from './dto/get-market-info.dto';
import { MarketSearchQueryDto } from './dto/market-search.dto';
import { MARKETS } from './constants/markets';

@Injectable()
export class MorphoService {
  async getPosition(
    chain: Chain,
    marketId: MarketId,
    address: Address,
  ): Promise<PositionResponseDto> {
    const chainConfig = getChainConfig(chain);
    const client = createPublicClient({
      chain: chainConfig,
      transport: http(),
    });

    const position = await AccrualPosition.fetch(address, marketId, client);

    if (!position) {
      throw new Error('Position not found');
    }

    return {
      position: {
        user: address,
        marketId,
        supplyShares: (position.supplyShares ?? 0n).toString(),
        borrowShares: (position.borrowShares ?? 0n).toString(),
        supplyAssets: (position.supplyAssets ?? 0n).toString(),
        borrowAssets: (position.borrowAssets ?? 0n).toString(),
        collateral: (position.collateral ?? 0n).toString(),
        market: {
          params: {
            collateralToken: position.market.params.collateralToken,
            loanToken: position.market.params.loanToken,
            oracle: position.market.params.oracle,
            irm: position.market.params.irm,
            lltv: position.market.params.lltv.toString(),
            id: position.market.params.id,
            liquidationIncentiveFactor:
              position.market.params.liquidationIncentiveFactor.toString(),
          },
          totalSupplyAssets: position.market.totalSupplyAssets.toString(),
          totalBorrowAssets: position.market.totalBorrowAssets.toString(),
          totalSupplyShares: position.market.totalSupplyShares.toString(),
          totalBorrowShares: position.market.totalBorrowShares.toString(),
          lastUpdate: position.market.lastUpdate.toString(),
          fee: position.market.fee.toString(),
          price: (position.market.price ?? 0n).toString(),
          rateAtTarget: (position.market.rateAtTarget ?? 0n).toString(),
        },
        healthFactor: position.healthFactor
          ? position.healthFactor.toString()
          : undefined,
        isHealthy: position.isHealthy,
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
