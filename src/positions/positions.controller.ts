// External dependencies
import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Address } from 'viem';

// Services
import { PositionsService } from './positions.service';

// DTOs and types
import {
  PositionsResponseDto,
  ChainPositionsDto,
} from '../common/dto/positions.dto';
import { Chain } from '../common/types/chain.type';

@ApiTags('positions')
@Controller('beta/v0/positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get(':address/:chain')
  @ApiOperation({ summary: 'Get user positions for a specific chain' })
  @ApiResponse({
    status: 200,
    description:
      'Returns the user positions information for the specified chain',
    type: ChainPositionsDto,
  })
  async getChainPositions(
    @Param('address') address: Address,
    @Param('chain') chain: Chain,
  ): Promise<ChainPositionsDto> {
    return this.positionsService.getChainPositions(address, chain);
  }

  @Get(':address')
  @ApiOperation({ summary: 'Get user positions across all supported chains' })
  @ApiResponse({
    status: 200,
    description:
      'Returns the user positions information across all supported chains',
    type: PositionsResponseDto,
  })
  async getAllPositions(
    @Param('address') address: Address,
  ): Promise<PositionsResponseDto> {
    return this.positionsService.getAllPositions(address);
  }
}
