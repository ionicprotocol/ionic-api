import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IonicService } from './ionic.service';
import { MarketsResponseDto } from './dto/market.dto';
import {
  PoolOperationRequestDto,
  PoolOperationResponseDto,
} from './dto/pool-operations.dto';
import { Chain } from '../common/types/chain.type';
import { ChainValidationPipe } from '../common/pipes/chain-validation.pipe';
import { MarketSearchQueryDto } from './dto/market-search.dto';
import { PositionsResponseDto } from './dto/position.dto';
import { Address } from 'viem';

@ApiTags('ionic')
@Controller('beta/v0/ionic')
export class IonicController {
  constructor(private readonly ionicService: IonicService) {}

  @Get('market')
  @ApiOperation({ summary: 'Get Ionic market information' })
  @ApiResponse({
    status: 200,
    description: 'Returns the market information',
    type: MarketsResponseDto,
  })
  async getMarketInfo(
    @Query() query: MarketSearchQueryDto,
  ): Promise<MarketsResponseDto> {
    return this.ionicService.getMarketInfo(query);
  }

  @Get('positions/:chain/:address')
  @ApiOperation({ summary: 'Get user positions in Ionic markets' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user positions across all markets',
    type: PositionsResponseDto,
  })
  async getPositions(
    @Param('chain', ChainValidationPipe) chain: Chain,
    @Param('address') address: Address,
  ): Promise<PositionsResponseDto> {
    return this.ionicService.getPositions(chain, address);
  }

  @Post('supply/:chain')
  @ApiOperation({ summary: 'Supply to Ionic pool' })
  @ApiResponse({
    status: 201,
    description: 'Returns the supply operation result',
    type: PoolOperationResponseDto,
  })
  async supply(
    @Param('chain', ChainValidationPipe) chain: Chain,
    @Body() request: PoolOperationRequestDto,
  ): Promise<PoolOperationResponseDto> {
    return this.ionicService.supply(chain, request);
  }

  @Post('withdraw/:chain')
  @ApiOperation({ summary: 'Withdraw from Ionic pool' })
  @ApiResponse({
    status: 201,
    description: 'Returns the withdraw operation result',
    type: PoolOperationResponseDto,
  })
  async withdraw(
    @Param('chain', ChainValidationPipe) chain: Chain,
    @Body() request: PoolOperationRequestDto,
  ): Promise<PoolOperationResponseDto> {
    return this.ionicService.withdraw(chain, request);
  }

  @Post('borrow/:chain')
  @ApiOperation({ summary: 'Borrow from Ionic pool' })
  @ApiResponse({
    status: 201,
    description: 'Returns the borrow operation result',
    type: PoolOperationResponseDto,
  })
  async borrow(
    @Param('chain', ChainValidationPipe) chain: Chain,
    @Body() request: PoolOperationRequestDto,
  ): Promise<PoolOperationResponseDto> {
    return this.ionicService.borrow(chain, request);
  }

  @Post('repay/:chain')
  @ApiOperation({ summary: 'Repay to Ionic pool' })
  @ApiResponse({
    status: 201,
    description: 'Returns the repay operation result',
    type: PoolOperationResponseDto,
  })
  async repay(
    @Param('chain', ChainValidationPipe) chain: Chain,
    @Body() request: PoolOperationRequestDto,
  ): Promise<PoolOperationResponseDto> {
    return this.ionicService.repay(chain, request);
  }
}
