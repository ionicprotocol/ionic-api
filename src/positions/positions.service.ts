// External dependencies
import { Injectable } from '@nestjs/common';
import { Address } from 'viem';

// Services
import { IonicService } from '../ionic/ionic.service';
import { MorphoService } from '../morpho/morpho.service';

// DTOs and types
import {
  PositionsResponseDto,
  ProtocolPositionDto,
  ChainPositionsDto,
} from '../common/dto/positions.dto';
import { Chain } from '../common/types/chain.type';
import { PositionsResponseDto as ProtocolPositionsResponseDto } from '../common/dto/position.dto';
import { Protocol } from './positions.controller';

const SUPPORTED_CHAINS: Chain[] = ['base', 'mode'];

@Injectable()
export class PositionsService {
  constructor(
    private readonly ionicService: IonicService,
    private readonly morphoService: MorphoService,
  ) {}

  async getChainPositions(
    address: Address,
    chain: Chain,
    protocol?: Protocol,
  ): Promise<ChainPositionsDto> {
    // Get positions from both protocols if no filter, or just the requested protocol
    const shouldGetIonic = !protocol || protocol === 'ionic';
    const shouldGetMorpho = !protocol || protocol === 'morpho';

    const positionPromises: Promise<ProtocolPositionsResponseDto>[] = [];
    if (shouldGetIonic) {
      positionPromises.push(this.ionicService.getPositions(chain, address));
    }
    if (shouldGetMorpho) {
      positionPromises.push(this.morphoService.getPositions(chain, address));
    }

    const positionResults = await Promise.allSettled(positionPromises);

    let ionicPositions: ProtocolPositionsResponseDto = {
      positions: { pools: [] },
    };
    let morphoPositions: ProtocolPositionsResponseDto = {
      positions: { pools: [] },
    };

    let resultIndex = 0;
    if (shouldGetIonic) {
      const result = positionResults[resultIndex];
      if (result.status === 'fulfilled') {
        ionicPositions = result.value;
      }
      resultIndex++;
    }
    if (shouldGetMorpho) {
      const result = positionResults[resultIndex];
      if (result.status === 'fulfilled') {
        morphoPositions = result.value;
      }
    }

    const protocols: ProtocolPositionDto[] = [];

    // Process Ionic positions if requested
    if (shouldGetIonic) {
      const ionicProtocolPosition: ProtocolPositionDto = {
        protocol: 'ionic',
        totalSupplyUsd: 0,
        totalBorrowUsd: 0,
        netValueUsd: 0,
        pools: ionicPositions.positions.pools.map((pool) => ({
          name: pool.name || '',
          poolId: pool.poolId,
          assets: pool.assets.map((asset) => ({
            asset: asset.underlyingSymbol,
            supplyBalance: asset.supplyBalance,
            supplyBalanceUsd: Number(asset.supplyBalanceUsd),
            borrowBalance: asset.borrowBalance,
            borrowBalanceUsd: Number(asset.borrowBalanceUsd),
          })),
          healthFactor: pool.healthFactor,
        })),
      };

      // Calculate Ionic totals
      ionicProtocolPosition.totalSupplyUsd = ionicProtocolPosition.pools.reduce(
        (sum, pool) =>
          sum +
          pool.assets.reduce(
            (assetSum, asset) => assetSum + asset.supplyBalanceUsd,
            0,
          ),
        0,
      );
      ionicProtocolPosition.totalBorrowUsd = ionicProtocolPosition.pools.reduce(
        (sum, pool) =>
          sum +
          pool.assets.reduce(
            (assetSum, asset) => assetSum + asset.borrowBalanceUsd,
            0,
          ),
        0,
      );
      ionicProtocolPosition.netValueUsd =
        ionicProtocolPosition.totalSupplyUsd -
        ionicProtocolPosition.totalBorrowUsd;

      protocols.push(ionicProtocolPosition);
    }

    // Process Morpho positions if requested
    if (shouldGetMorpho) {
      const morphoProtocolPosition: ProtocolPositionDto = {
        protocol: 'morpho',
        totalSupplyUsd: 0,
        totalBorrowUsd: 0,
        netValueUsd: 0,
        pools: morphoPositions.positions.pools.map((pool) => ({
          name: '',
          poolId: pool.poolId,
          assets: pool.assets.map((asset) => ({
            asset: asset.underlyingSymbol,
            supplyBalance: asset.supplyBalance,
            supplyBalanceUsd: Number(asset.supplyBalanceUsd),
            borrowBalance: asset.borrowBalance,
            borrowBalanceUsd: Number(asset.borrowBalanceUsd),
          })),
          healthFactor: pool.healthFactor,
        })),
      };

      // Calculate Morpho totals
      morphoProtocolPosition.totalSupplyUsd =
        morphoProtocolPosition.pools.reduce(
          (sum, pool) =>
            sum +
            pool.assets.reduce(
              (assetSum, asset) => assetSum + asset.supplyBalanceUsd,
              0,
            ),
          0,
        );
      morphoProtocolPosition.totalBorrowUsd =
        morphoProtocolPosition.pools.reduce(
          (sum, pool) =>
            sum +
            pool.assets.reduce(
              (assetSum, asset) => assetSum + asset.borrowBalanceUsd,
              0,
            ),
          0,
        );
      morphoProtocolPosition.netValueUsd =
        morphoProtocolPosition.totalSupplyUsd -
        morphoProtocolPosition.totalBorrowUsd;

      protocols.push(morphoProtocolPosition);
    }

    // Calculate chain totals
    const totalSupplyUsd = protocols.reduce(
      (sum, protocol) => sum + protocol.totalSupplyUsd,
      0,
    );
    const totalBorrowUsd = protocols.reduce(
      (sum, protocol) => sum + protocol.totalBorrowUsd,
      0,
    );
    const totalValueUsd = totalSupplyUsd - totalBorrowUsd;

    return {
      chain,
      totalValueUsd,
      totalSupplyUsd,
      totalBorrowUsd,
      protocols,
    };
  }

  async getAllPositions(
    address: Address,
    protocol?: Protocol,
  ): Promise<PositionsResponseDto> {
    // Get positions for each supported chain
    const chains = await Promise.all(
      SUPPORTED_CHAINS.map((chain) =>
        this.getChainPositions(address, chain, protocol),
      ),
    );

    // Calculate totals across all chains
    const totalValueUsd = chains.reduce(
      (sum, chain) => sum + chain.totalValueUsd,
      0,
    );
    const totalSupplyUsd = chains.reduce(
      (sum, chain) => sum + chain.totalSupplyUsd,
      0,
    );
    const totalBorrowUsd = chains.reduce(
      (sum, chain) => sum + chain.totalBorrowUsd,
      0,
    );

    return {
      totalValueUsd,
      totalSupplyUsd,
      totalBorrowUsd,
      chains,
    };
  }
}
