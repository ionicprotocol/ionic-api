import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { IonicModule } from '../ionic/ionic.module';
import { MorphoModule } from '../morpho/morpho.module';

@Module({
  imports: [IonicModule, MorphoModule],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
