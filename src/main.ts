import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
      enableDebugMessages: true,
    }),
  );
  app.enableCors({
    origin: configService.get<string>(GLOBAL_CONFIG.CORS_ALLOW_ORIGIN),
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    optionsSuccessStatus: 200,
    exposedHeaders: 'Authorization',
  });

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Edusaig API')
    .setDescription('This is the Edusaig API documentation')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(configService.get<string>(GLOBAL_CONFIG.PORT) ?? 3000);
}

bootstrap();
