import { Module } from '@nestjs/common';
import { MorphoController } from './morpho.controller';
import { MorphoService } from './morpho.service';

@Module({
  controllers: [MorphoController],
  providers: [MorphoService],
})
export class MorphoModule {}
