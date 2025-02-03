import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MorphoModule } from './morpho/morpho.module';
import { IonicModule } from './ionic/ionic.module';
import { DatabaseModule } from './common/database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PortfolioModule } from './portfolio/portfolio.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    MorphoModule,
    IonicModule,
    PortfolioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
