import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDatabase } from 'typeorm-extension';
import { databaseConfig } from './shared/configs/database.config';
import { GLOBAL_CONFIG } from './shared/constants/global-config.constant';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

    const config = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('Cats example')
        .setDescription('The cats API description')
        .setVersion('1.0')
        .addTag('cats')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, documentFactory);

    await app.listen(configService.get<string>(GLOBAL_CONFIG.PORT) ?? 3000);
}

bootstrap();
