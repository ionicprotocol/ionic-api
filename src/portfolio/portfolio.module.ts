// External dependencies
import { Module } from '@nestjs/common';

// Modules
import { IonicModule } from '../ionic/ionic.module';
import { MorphoModule } from '../morpho/morpho.module';

// Controllers and Services
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';

@Module({
  imports: [IonicModule, MorphoModule],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
