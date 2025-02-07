// External dependencies
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Address } from 'viem';

// Services
import { MorphoService } from './morpho.service';

// DTOs and types
import { Chain } from '../common/types/chain.type';
import { MarketsResponseDto } from '../common/dto/market.dto';
import { MarketSearchQueryDto } from './dto/market-search.dto';
import { PositionsResponseDto } from '../common/dto/position.dto';

@ApiTags('morpho')
@Controller('beta/v0/morpho')
export class MorphoController {
  constructor(private readonly morphoService: MorphoService) {}

  @Get('positions/:chain/:address')
  @ApiOperation({ summary: 'Get user positions in Morpho markets' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user positions information',
    type: PositionsResponseDto,
  })
  async getPositions(
    @Param('chain') chain: Chain,
    @Param('address') address: Address,
  ): Promise<PositionsResponseDto> {
    return this.morphoService.getPositions(chain, address);
  }

  @Get('market')
  @ApiOperation({ summary: 'Get Morpho market information' })
  @ApiResponse({
    status: 200,
    description: 'Returns the market information',
    type: MarketsResponseDto,
  })
  async getMarketInfo(
    @Query() query: MarketSearchQueryDto,
  ): Promise<MarketsResponseDto> {
    return this.morphoService.getMarketInfo(query);
  }
}
