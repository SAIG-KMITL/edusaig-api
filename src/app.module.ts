import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { DatabaseModule } from './database/database.module';
import { databaseConfig } from './shared/configs/database.config';
import { dotenvConfig } from './shared/configs/dotenv.config';
import { GLOBAL_CONFIG } from './shared/constants/global-config.constant';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';

const forFeatures = TypeOrmModule.forFeature([User]);

@Module({
  imports: [
    forFeatures,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: dotenvConfig,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...databaseConfig,
        migrations: ['dist/database/migrations/*.js'],
        migrationsRun: true,
        synchronize: configService.get<boolean>(GLOBAL_CONFIG.IS_DEVELOPMENT),
      }),
      inject: [ConfigService],
    }),
    JwtModule.register({
      global: true,
    }),
    DatabaseModule,
    UserModule,
    CourseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
