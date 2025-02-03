import { Injectable } from '@nestjs/common';
import { Address } from 'viem';
import { IonicService } from '../ionic/ionic.service';
import { MorphoService } from '../morpho/morpho.service';
import { PortfolioResponseDto } from '../common/dto/portfolio.dto';

@Injectable()
export class PortfolioService {
  constructor(
    private readonly ionicService: IonicService,
    private readonly morphoService: MorphoService,
  ) {}

  getPortfolio(address: Address): Promise<PortfolioResponseDto> {
    // TODO: Implement portfolio aggregation logic
    // 1. Get positions from Ionic across all chains
    // 2. Get positions from Morpho across all chains
    // 3. Aggregate and calculate totals
    // 4. Format response according to DTO
    throw new Error('Not implemented');
  }
}
