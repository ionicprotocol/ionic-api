import { Module } from '@nestjs/common';
import { IonicController } from './ionic.controller';
import { IonicService } from './ionic.service';
import { DatabaseModule } from '../common/database/database.module';
import { SharedModule } from 'src/common/shared.module';

@Module({
  imports: [DatabaseModule, SharedModule],
  controllers: [IonicController],
  providers: [IonicService],
  exports: [IonicService],
})
export class IonicModule {}
