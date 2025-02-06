// External dependencies
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { Address } from 'viem';

// Services
import { PositionsService } from './positions.service';

// DTOs and types
import {
  PositionsResponseDto,
  ChainPositionsDto,
} from '../common/dto/positions.dto';
import { Chain } from '../common/types/chain.type';

// Protocol definitions
export const PROTOCOLS = ['ionic', 'morpho'];
export type Protocol = (typeof PROTOCOLS)[number];

@ApiTags('positions')
@Controller('beta/v0/positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get(':address')
  @ApiOperation({
    summary: 'Get user positions for a specific chain or all chains',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the user positions information',
    type: PositionsResponseDto,
  })
  @ApiQuery({
    name: 'protocol',
    required: false,
    description: 'Filter positions by protocol (e.g., ionic, morpho)',
    enum: PROTOCOLS,
  })
  @ApiQuery({
    name: 'chain',
    required: false,
    description:
      'Filter positions by chain (e.g., base, mode). If not provided, returns positions for all chains',
    type: 'string',
  })
  async getPositions(
    @Param('address') address: Address,
    @Query('protocol') protocol?: string,
    @Query('chain') chain?: Chain,
  ): Promise<PositionsResponseDto | ChainPositionsDto> {
    if (chain) {
      return this.positionsService.getChainPositions(
        address,
        chain,
        protocol?.toLowerCase(),
      );
    }
    return this.positionsService.getAllPositions(
      address,
      protocol?.toLowerCase(),
    );
  }
}
