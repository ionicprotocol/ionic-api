import { Module } from '@nestjs/common';
import { MorphoController } from './morpho.controller';
import { MorphoService } from './morpho.service';
import { MorphoGraphQLService } from './services/graphql.service';

@Module({
  controllers: [MorphoController],
  providers: [MorphoService, MorphoGraphQLService],
  exports: [MorphoService],
})
export class MorphoModule {}
