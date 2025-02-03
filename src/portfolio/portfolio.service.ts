// External dependencies
import { Injectable } from '@nestjs/common';
import { Address } from 'viem';

// Services
import { IonicService } from '../ionic/ionic.service';
import { MorphoService } from '../morpho/morpho.service';

// DTOs and types
import {
  PortfolioResponseDto,
  ProtocolPositionDto,
  ChainPortfolioDto,
} from '../common/dto/portfolio.dto';
import { Chain } from '../common/types/chain.type';
import { PositionsResponseDto } from '../common/dto/position.dto';

const SUPPORTED_CHAINS: Chain[] = ['base', 'mode'];

@Injectable()
export class PortfolioService {
  constructor(
    private readonly ionicService: IonicService,
    private readonly morphoService: MorphoService,
  ) {}

  async getPortfolioByChain(
    address: Address,
    chain: Chain,
  ): Promise<ChainPortfolioDto> {
    // Get positions from both protocols
    const [ionicPositionsResult, morphoPositionsResult] =
      await Promise.allSettled([
        this.ionicService.getPositions(chain, address),
        this.morphoService.getPositions(chain, address),
      ]);

    let ionicPositions: PositionsResponseDto = { positions: { pools: [] } };
    if (ionicPositionsResult.status === 'fulfilled') {
      ionicPositions = ionicPositionsResult.value;
    }

    let morphoPositions: PositionsResponseDto = { positions: { pools: [] } };
    if (morphoPositionsResult.status === 'fulfilled') {
      morphoPositions = morphoPositionsResult.value;
    }

    // Process Ionic positions
    const ionicProtocolPosition: ProtocolPositionDto = {
      protocol: 'Ionic',
      total_supply_usd: 0,
      total_borrow_usd: 0,
      net_value_usd: 0,
      positions: ionicPositions.positions.pools.flatMap((pool) =>
        pool.assets.map((asset) => ({
          asset: asset.underlyingSymbol,
          supply_balance: asset.supplyBalance,
          supply_balance_usd: Number(asset.supplyBalanceUsd),
          borrow_balance: asset.borrowBalance,
          borrow_balance_usd: Number(asset.borrowBalanceUsd),
          health_factor: pool.healthFactor,
        })),
      ),
    };

    // Calculate Ionic totals
    ionicProtocolPosition.total_supply_usd =
      ionicProtocolPosition.positions.reduce(
        (sum, pos) => sum + pos.supply_balance_usd,
        0,
      );
    ionicProtocolPosition.total_borrow_usd =
      ionicProtocolPosition.positions.reduce(
        (sum, pos) => sum + pos.borrow_balance_usd,
        0,
      );
    ionicProtocolPosition.net_value_usd =
      ionicProtocolPosition.total_supply_usd -
      ionicProtocolPosition.total_borrow_usd;

    // Process Morpho positions
    const morphoProtocolPosition: ProtocolPositionDto = {
      protocol: 'Morpho',
      total_supply_usd: 0,
      total_borrow_usd: 0,
      net_value_usd: 0,
      positions: morphoPositions.positions.pools.flatMap((pool) =>
        pool.assets.map((asset) => ({
          asset: asset.underlyingSymbol,
          supply_balance: asset.supplyBalance,
          supply_balance_usd: Number(asset.supplyBalanceUsd),
          borrow_balance: asset.borrowBalance,
          borrow_balance_usd: Number(asset.borrowBalanceUsd),
          health_factor: pool.healthFactor,
        })),
      ),
    };

    // Calculate Morpho totals
    morphoProtocolPosition.total_supply_usd =
      morphoProtocolPosition.positions.reduce(
        (sum, pos) => sum + pos.supply_balance_usd,
        0,
      );
    morphoProtocolPosition.total_borrow_usd =
      morphoProtocolPosition.positions.reduce(
        (sum, pos) => sum + pos.borrow_balance_usd,
        0,
      );
    morphoProtocolPosition.net_value_usd =
      morphoProtocolPosition.total_supply_usd -
      morphoProtocolPosition.total_borrow_usd;

    // Calculate chain totals
    const total_supply_usd =
      ionicProtocolPosition.total_supply_usd +
      morphoProtocolPosition.total_supply_usd;
    const total_borrow_usd =
      ionicProtocolPosition.total_borrow_usd +
      morphoProtocolPosition.total_borrow_usd;
    const total_value_usd = total_supply_usd - total_borrow_usd;

    return {
      total_value_usd,
      total_supply_usd,
      total_borrow_usd,
      protocols: [ionicProtocolPosition, morphoProtocolPosition],
    };
  }

  async getPortfolio(address: Address): Promise<PortfolioResponseDto> {
    // Get portfolio for each supported chain
    const chainPortfolios = await Promise.all(
      SUPPORTED_CHAINS.map((chain) => this.getPortfolioByChain(address, chain)),
    );

    // Initialize totals
    let total_value_usd = 0;
    let total_supply_usd = 0;
    let total_borrow_usd = 0;

    // Create positions by chain
    const positions = SUPPORTED_CHAINS.reduce(
      (acc, chain, index) => {
        const portfolio = chainPortfolios[index];
        total_value_usd += portfolio.total_value_usd;
        total_supply_usd += portfolio.total_supply_usd;
        total_borrow_usd += portfolio.total_borrow_usd;
        acc[chain] = portfolio;
        return acc;
      },
      {} as Record<Chain, ChainPortfolioDto>,
    );

    return {
      total_value_usd,
      total_supply_usd,
      total_borrow_usd,
      positions,
    };
  }
}
