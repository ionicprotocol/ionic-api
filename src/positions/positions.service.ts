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
  ): Promise<ChainPositionsDto> {
    // Get positions from both protocols
    const [ionicPositionsResult, morphoPositionsResult] =
      await Promise.allSettled([
        this.ionicService.getPositions(chain, address),
        this.morphoService.getPositions(chain, address),
      ]);

    let ionicPositions: ProtocolPositionsResponseDto = {
      positions: { pools: [] },
    };
    if (ionicPositionsResult.status === 'fulfilled') {
      ionicPositions = ionicPositionsResult.value;
    }

    let morphoPositions: ProtocolPositionsResponseDto = {
      positions: { pools: [] },
    };
    if (morphoPositionsResult.status === 'fulfilled') {
      morphoPositions = morphoPositionsResult.value;
    }

    // Process Ionic positions
    const ionicProtocolPosition: ProtocolPositionDto = {
      protocol: 'Ionic',
      totalSupplyUsd: 0,
      totalBorrowUsd: 0,
      netValueUsd: 0,
      pools: ionicPositions.positions.pools.map((pool) => ({
        name: pool.name,
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

    // Process Morpho positions
    const morphoProtocolPosition: ProtocolPositionDto = {
      protocol: 'Morpho',
      totalSupplyUsd: 0,
      totalBorrowUsd: 0,
      netValueUsd: 0,
      pools: morphoPositions.positions.pools.map((pool) => ({
        name: pool.name || 'Main Pool',
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
    morphoProtocolPosition.totalSupplyUsd = morphoProtocolPosition.pools.reduce(
      (sum, pool) =>
        sum +
        pool.assets.reduce(
          (assetSum, asset) => assetSum + asset.supplyBalanceUsd,
          0,
        ),
      0,
    );
    morphoProtocolPosition.totalBorrowUsd = morphoProtocolPosition.pools.reduce(
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

    // Calculate chain totals
    const totalSupplyUsd =
      ionicProtocolPosition.totalSupplyUsd +
      morphoProtocolPosition.totalSupplyUsd;
    const totalBorrowUsd =
      ionicProtocolPosition.totalBorrowUsd +
      morphoProtocolPosition.totalBorrowUsd;
    const totalValueUsd = totalSupplyUsd - totalBorrowUsd;

    return {
      chain,
      totalValueUsd,
      totalSupplyUsd,
      totalBorrowUsd,
      protocols: [ionicProtocolPosition, morphoProtocolPosition],
    };
  }

  async getAllPositions(address: Address): Promise<PositionsResponseDto> {
    // Get positions for each supported chain
    const chains = await Promise.all(
      SUPPORTED_CHAINS.map((chain) => this.getChainPositions(address, chain)),
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
