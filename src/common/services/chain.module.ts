import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChainService } from './chain.service';

@Module({
  imports: [ConfigModule],
  providers: [ChainService],
  exports: [ChainService],
})
export class ChainModule {}
