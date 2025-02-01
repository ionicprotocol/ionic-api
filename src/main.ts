import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  // @ts-expect-error BigInt.prototype.toJSON is not defined
  BigInt.prototype.toJSON = function (this: bigint): string {
    const int = Number.parseInt(this.toString());
    return int.toString() ?? this.toString();
  };

  const app = await NestFactory.create(AppModule);

  // Enable validation pipe globally
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable logging interceptor globally
  app.useGlobalInterceptors(new LoggingInterceptor(new Reflector()));

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Ionic API')
    .setDescription('The Ionic API description')
    .setVersion('2.0')
    .addTag('ionic')
    .addTag('morpho')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Enable CORS
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
