import { Module } from '@nestjs/common';
import { IonicController } from './ionic.controller';
import { IonicService } from './ionic.service';
import { DatabaseModule } from '../common/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [IonicController],
  providers: [IonicService],
})
export class IonicModule {}
