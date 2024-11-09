import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { createDatabase } from 'typeorm-extension';
import { AppModule } from './app.module';
import { databaseConfig } from './shared/configs/database.config';
import { GLOBAL_CONFIG } from './shared/constants/global-config.constant';

async function bootstrap() {
  const configService = new ConfigService();

  await createDatabase({
    options: databaseConfig,
  });

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: configService.get<string>(GLOBAL_CONFIG.CORS_ALLOW_ORIGIN),
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    optionsSuccessStatus: 200,
    exposedHeaders: 'Authorization',
  });

  await app.listen(configService.get<string>(GLOBAL_CONFIG.PORT) ?? 3000);
}

bootstrap();
