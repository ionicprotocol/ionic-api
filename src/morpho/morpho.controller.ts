// External dependencies
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MarketId } from '@morpho-org/blue-sdk';
import { Address } from 'viem';

// Services
import { MorphoService } from './morpho.service';

// DTOs and types
import { Chain } from '../common/types/chain.type';
import { MarketsResponseDto } from './dto/get-market-info.dto';
import { MarketSearchQueryDto } from './dto/market-search.dto';
import { PositionsResponseDto } from '../common/dto/position.dto';

// Pipes
import { ChainValidationPipe } from '../common/pipes/chain-validation.pipe';

@ApiTags('morpho')
@Controller('beta/v0/morpho')
export class MorphoController {
  constructor(private readonly morphoService: MorphoService) {}

  @Get('position/:chain/:marketId/:sender')
  @ApiOperation({ summary: 'Get position for a specific market' })
  @ApiResponse({
    status: 200,
    description: 'Returns the position details',
    type: PositionsResponseDto,
  })
  async getPosition(
    @Param('chain', ChainValidationPipe) chain: Chain,
    @Param('marketId') marketId: MarketId,
    @Param('sender') sender: Address,
  ): Promise<PositionsResponseDto> {
    return this.morphoService.getPosition(chain, marketId, sender);
  }

  @Get('market/:chain')
  @ApiOperation({ summary: 'Get Morpho market details' })
  @ApiResponse({
    status: 200,
    description: 'Returns the market details',
    type: MarketsResponseDto,
  })
  async getMarketInfo(
    @Param('chain', ChainValidationPipe) chain: Chain,
    @Query() query: MarketSearchQueryDto,
  ): Promise<MarketsResponseDto> {
    return this.morphoService.getMarketInfo(chain, query);
  }

  @Get('positions/:chain/:address')
  @ApiOperation({
    summary: 'Get all user positions in Morpho markets for a chain',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns all user positions across Morpho markets on a chain',
    type: PositionsResponseDto,
  })
  async getPositions(
    @Param('chain', ChainValidationPipe) chain: Chain,
    @Param('address') address: Address,
  ): Promise<PositionsResponseDto> {
    return this.morphoService.getPositions(chain, address);
  }
}
