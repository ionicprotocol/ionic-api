import { Module } from '@nestjs/common';
import { PriceFeedService } from './services/price-feed.service';
import { ConfigModule } from '@nestjs/config';
import { ChainService } from './services/chain.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [PriceFeedService, ChainService],
  exports: [PriceFeedService, ChainService],
})
export class SharedModule {}
