import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Address } from 'viem';
import { PortfolioService } from './portfolio.service';
import { PortfolioResponseDto } from '../common/dto/portfolio.dto';

@ApiTags('portfolio')
@Controller('beta/v0/portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get(':address')
  @ApiOperation({ summary: 'Get user portfolio across all protocols' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user portfolio information across all protocols',
    type: PortfolioResponseDto,
  })
  async getPortfolio(
    @Param('address') address: Address,
  ): Promise<PortfolioResponseDto> {
    return this.portfolioService.getPortfolio(address);
  }
}
