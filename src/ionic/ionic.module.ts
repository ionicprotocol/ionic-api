import { Module } from '@nestjs/common';
import { IonicController } from './ionic.controller';
import { IonicService } from './ionic.service';
import { DatabaseModule } from '../common/database/database.module';
import { ChainModule } from '../common/services/chain.module';

@Module({
  imports: [DatabaseModule, ChainModule],
  controllers: [IonicController],
  providers: [IonicService],
  exports: [IonicService],
})
export class IonicModule {}
