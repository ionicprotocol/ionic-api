import { Module } from '@nestjs/common';
import { AaveService } from './aave.service';
import { AaveController } from './aave.controller';
import { SharedModule } from '../common/shared.module';
import { DatabaseModule } from '../common/database/database.module';

@Module({
  imports: [
    SharedModule,
    DatabaseModule,
  ],
  controllers: [AaveController],
  providers: [AaveService],
  exports: [AaveService],
})
export class AaveModule {}