import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MorphoModule } from './morpho/morpho.module';
import { IonicModule } from './ionic/ionic.module';
import { DatabaseModule } from './common/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    MorphoModule,
    IonicModule,
  ],
})
export class AppModule {}
