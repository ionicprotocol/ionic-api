import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Address } from 'viem';
import { PortfolioService } from './portfolio.service';
import { PortfolioResponseDto } from '../common/dto/portfolio.dto';
import { Chain } from 'src/common/types/chain.type';

@ApiTags('portfolio')
@Controller('beta/v0/portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get(':address/:chain')
  @ApiOperation({ summary: 'Get user portfolio for a specific chain' })
  @ApiResponse({
    status: 200,
    description:
      'Returns the user portfolio information for the specified chain',
    type: PortfolioResponseDto,
  })
  async getPortfolioByChain(
    @Param('address') address: Address,
    @Param('chain') chain: Chain,
  ): Promise<PortfolioResponseDto> {
    return this.portfolioService.getPortfolioByChain(address, chain);
  }

  @Get(':address')
  @ApiOperation({ summary: 'Get user portfolio across all supported chains' })
  @ApiResponse({
    status: 200,
    description:
      'Returns the user portfolio information across all supported chains',
    type: PortfolioResponseDto,
  })
  async getPortfolio(
    @Param('address') address: Address,
  ): Promise<PortfolioResponseDto> {
    return this.portfolioService.getPortfolio(address);
  }
}
