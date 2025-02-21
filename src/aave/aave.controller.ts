import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AaveService } from './aave.service';
// import { BaseRequestDto } from '../common/dto/base-request.dto';
import { PositionsResponseDto } from '../common/dto/position.dto';
import { Chain } from '../common/types/chain.type';
import { AaveOperationDto } from './dto/aave-operation.dto';
import { AaveOperationParams } from './dto/aave-operation.dto';
import { TOKEN_ADDRESSES, TOKEN_DECIMALS } from './constants/tokens';

@ApiTags('aave')
@Controller('beta/v0/aave')
export class AaveController {
  constructor(private readonly aaveService: AaveService) {}

  @Get('market/:chain')
  @ApiOperation({ summary: 'Get Aave market information for a specific chain' })
  @ApiParam({ name: 'chain', enum: ['optimism', 'base'] })
  @ApiResponse({
    status: 200,
    description: 'Returns market information for the specified chain',
  })
  async getMarketInfo(@Param('chain') chain: Chain) {
    return this.aaveService.getMarketInfo(chain);
  }

  @Get('position/:chain/:address')
  @ApiOperation({ summary: 'Get user positions in Aave markets' })
  @ApiParam({ name: 'chain', enum: ['optimism', 'base'] })
  @ApiParam({ name: 'address', description: 'User address' })
  @ApiResponse({
    status: 200,
    description: 'Returns user positions',
    type: PositionsResponseDto
  })
  async getPositions(
    @Param('chain') chain: Chain,
    @Param('address') address: string,
  ) {
    return this.aaveService.getPositions(chain, address);
  }

  @Post('supply/:chain')
  @ApiOperation({ summary: 'Supply assets to Aave pool' })
  @ApiParam({ name: 'chain', enum: ['optimism', 'base'] })
  async supply(
    @Param('chain') chain: Chain,
    @Body() dto: AaveOperationDto,
  ) {
    const tokenAddress = TOKEN_ADDRESSES[chain]?.[dto.call_data.asset];
    if (!tokenAddress) {
      throw new Error(`Unsupported token ${dto.call_data.asset} on chain ${chain}`);
    }

    const decimals = TOKEN_DECIMALS[dto.call_data.asset as keyof typeof TOKEN_DECIMALS] || 18;
    const amount = BigInt(Math.floor(dto.call_data.amount * (10 ** decimals)));

    const params: AaveOperationParams = {
      tokenAddress,
      amount,
      userAddress: dto.call_data.on_behalf_of as `0x${string}`
    };
    return this.aaveService.supply(chain, params);
  }

  @Post('withdraw/base')
  @ApiOperation({ summary: 'Withdraw assets from Aave pool' })
  async withdraw(
    @Body() withdrawData: AaveOperationDto,
  ) {
    const chain = 'base';
    const tokenAddress = TOKEN_ADDRESSES[chain]?.[withdrawData.call_data.asset];
    if (!tokenAddress) {
      throw new Error(`Unsupported token ${withdrawData.call_data.asset} on chain ${chain}`);
    }

    const decimals = TOKEN_DECIMALS[withdrawData.call_data.asset as keyof typeof TOKEN_DECIMALS] || 18;
    const amount = BigInt(Math.floor(withdrawData.call_data.amount * (10 ** decimals)));

    const params: AaveOperationParams = {
      tokenAddress,
      amount,
      userAddress: withdrawData.call_data.on_behalf_of as `0x${string}`
    };
    return this.aaveService.withdraw(chain, params);
  }

  @Post('borrow/base')
  @ApiOperation({ summary: 'Borrow assets from Aave pool' })
  async borrow(
    @Body() borrowData: AaveOperationDto,
  ) {
    const chain = 'base';
    const tokenAddress = TOKEN_ADDRESSES[chain]?.[borrowData.call_data.asset];
    if (!tokenAddress) {
      throw new Error(`Unsupported token ${borrowData.call_data.asset} on chain ${chain}`);
    }

    const decimals = TOKEN_DECIMALS[borrowData.call_data.asset as keyof typeof TOKEN_DECIMALS] || 18;
    const amount = BigInt(Math.floor(borrowData.call_data.amount * (10 ** decimals)));

    const params: AaveOperationParams = {
      tokenAddress,
      amount,
      userAddress: borrowData.call_data.on_behalf_of as `0x${string}`
    };
    return this.aaveService.borrow(chain, params);
  }

  @Post('repay/base')
  @ApiOperation({ summary: 'Repay borrowed assets to Aave pool' })
  async repay(
    @Body() repayData: AaveOperationDto,
  ) {
    const chain = 'base';
    const tokenAddress = TOKEN_ADDRESSES[chain]?.[repayData.call_data.asset];
    if (!tokenAddress) {
      throw new Error(`Unsupported token ${repayData.call_data.asset} on chain ${chain}`);
    }

    const decimals = TOKEN_DECIMALS[repayData.call_data.asset as keyof typeof TOKEN_DECIMALS] || 18;
    const amount = BigInt(Math.floor(repayData.call_data.amount * (10 ** decimals)));

    const params: AaveOperationParams = {
      tokenAddress,
      amount,
      userAddress: repayData.call_data.on_behalf_of as `0x${string}`
    };
    return this.aaveService.repay(chain, params);
  }
} 