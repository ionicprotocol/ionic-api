import { Injectable } from '@nestjs/common';
import { Address } from 'viem';
import { IonicService } from '../ionic/ionic.service';
import { MorphoService } from '../morpho/morpho.service';
import {
  PortfolioResponseDto,
  ProtocolPositionDto,
} from '../common/dto/portfolio.dto';
import { Chain } from 'src/common/types/chain.type';

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
  ): Promise<PortfolioResponseDto> {
    // Get positions from both protocols
    const [ionicPositions, morphoPositions] = await Promise.all([
      this.ionicService.getPositions(chain, address),
      this.morphoService.getPositions(chain, address),
    ]);

    // Initialize empty positions for all chains
    const emptyPositions = SUPPORTED_CHAINS.reduce(
      (acc, chainName) => ({ ...acc, [chainName]: [] }),
      {} as Record<
        Chain,
        Array<{
          asset: string;
          supply_balance: string;
          supply_balance_usd: number;
          borrow_balance: string;
          borrow_balance_usd: number;
          health_factor: string;
        }>
      >,
    );

    // Process Ionic positions
    const ionicProtocolPosition: ProtocolPositionDto = {
      protocol: 'Ionic',
      total_supply_usd: 0,
      total_borrow_usd: 0,
      net_value_usd: 0,
      positions: {
        ...emptyPositions,
        [chain]: ionicPositions.positions.pools.flatMap((pool) =>
          pool.assets.map((asset) => ({
            asset: asset.underlyingSymbol,
            supply_balance: asset.supplyBalance,
            supply_balance_usd: Number(asset.supplyBalanceUsd),
            borrow_balance: asset.borrowBalance,
            borrow_balance_usd: Number(asset.borrowBalanceUsd),
            health_factor: pool.healthFactor,
          })),
        ),
      },
    };

    // Calculate Ionic totals
    ionicProtocolPosition.total_supply_usd = ionicProtocolPosition.positions[
      chain
    ].reduce((sum, pos) => sum + pos.supply_balance_usd, 0);
    ionicProtocolPosition.total_borrow_usd = ionicProtocolPosition.positions[
      chain
    ].reduce((sum, pos) => sum + pos.borrow_balance_usd, 0);
    ionicProtocolPosition.net_value_usd =
      ionicProtocolPosition.total_supply_usd -
      ionicProtocolPosition.total_borrow_usd;

    // Process Morpho positions
    const morphoProtocolPosition: ProtocolPositionDto = {
      protocol: 'Morpho',
      total_supply_usd: 0,
      total_borrow_usd: 0,
      net_value_usd: 0,
      positions: {
        ...emptyPositions,
        [chain]: morphoPositions.positions.pools.flatMap((pool) =>
          pool.assets.map((asset) => ({
            asset: asset.underlyingSymbol,
            supply_balance: asset.supplyBalance,
            supply_balance_usd: Number(asset.supplyBalanceUsd),
            borrow_balance: asset.borrowBalance,
            borrow_balance_usd: Number(asset.borrowBalanceUsd),
            health_factor: pool.healthFactor,
          })),
        ),
      },
    };

    // Calculate Morpho totals
    morphoProtocolPosition.total_supply_usd = morphoProtocolPosition.positions[
      chain
    ].reduce((sum, pos) => sum + pos.supply_balance_usd, 0);
    morphoProtocolPosition.total_borrow_usd = morphoProtocolPosition.positions[
      chain
    ].reduce((sum, pos) => sum + pos.borrow_balance_usd, 0);
    morphoProtocolPosition.net_value_usd =
      morphoProtocolPosition.total_supply_usd -
      morphoProtocolPosition.total_borrow_usd;

    // Calculate portfolio totals
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

    // Initialize protocols array with empty positions for each chain
    const protocols: ProtocolPositionDto[] = [
      {
        protocol: 'Ionic',
        total_supply_usd: 0,
        total_borrow_usd: 0,
        net_value_usd: 0,
        positions: SUPPORTED_CHAINS.reduce(
          (acc, chain) => ({ ...acc, [chain]: [] }),
          {} as Record<Chain, any[]>,
        ),
      },
      {
        protocol: 'Morpho',
        total_supply_usd: 0,
        total_borrow_usd: 0,
        net_value_usd: 0,
        positions: SUPPORTED_CHAINS.reduce(
          (acc, chain) => ({ ...acc, [chain]: [] }),
          {} as Record<Chain, any[]>,
        ),
      },
    ];

    // Aggregate data from each chain
    chainPortfolios.forEach((portfolio, index) => {
      const chain = SUPPORTED_CHAINS[index];

      // Add to totals
      total_value_usd += portfolio.total_value_usd;
      total_supply_usd += portfolio.total_supply_usd;
      total_borrow_usd += portfolio.total_borrow_usd;

      // Aggregate protocol data
      portfolio.protocols.forEach((chainProtocol) => {
        const protocolIndex = protocols.findIndex(
          (p) => p.protocol === chainProtocol.protocol,
        );
        if (protocolIndex !== -1) {
          const protocol = protocols[protocolIndex];
          protocol.total_supply_usd += chainProtocol.total_supply_usd;
          protocol.total_borrow_usd += chainProtocol.total_borrow_usd;
          protocol.net_value_usd += chainProtocol.net_value_usd;
          protocol.positions[chain] = chainProtocol.positions[chain];
        }
      });
    });

    return {
      total_value_usd,
      total_supply_usd,
      total_borrow_usd,
      protocols,
    };
  }
}
