import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MorphoService } from './morpho.service';
import { PositionResponseDto } from './dto/get-position.dto';
import { Chain } from '../common/types/chain.type';
import { ChainValidationPipe } from '../common/pipes/chain-validation.pipe';
import { MarketId } from '@morpho-org/blue-sdk';
import { Address } from 'viem';
import { MarketsResponseDto } from './dto/get-market-info.dto';
import { MarketSearchQueryDto } from './dto/market-search.dto';

@ApiTags('morpho')
@Controller('beta/v0/morpho')
export class MorphoController {
  constructor(private readonly morphoService: MorphoService) {}

  @Get('position/:chain/:marketId/:sender')
  @ApiOperation({ summary: 'Get Morpho position details' })
  @ApiResponse({
    status: 200,
    description: 'Returns the position details',
    type: PositionResponseDto,
  })
  async getPosition(
    @Param('chain', ChainValidationPipe) chain: Chain,
    @Param('marketId') marketId: MarketId,
    @Param('sender') sender: Address,
  ): Promise<PositionResponseDto> {
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
}
