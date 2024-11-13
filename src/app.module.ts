import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { dotenvConfig } from './shared/configs/dotenv.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { databaseConfig } from './shared/configs/database.config';
import { GLOBAL_CONFIG } from './shared/constants/global-config.constant';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { UserStreak } from './user-streak/user-streak.entity';
import { UserStreakModule } from './user-streak/user-streak.module';
import { RolesGuard } from './shared/guards/role.guard';
import { CourseModule } from './course/course.module';

const forFeatures = TypeOrmModule.forFeature([User, UserStreak]);

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
                migrations: ["dist/database/migrations/*.js"],
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
        UserStreakModule,
        CourseModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        }
    ],
})
export class AppModule { }
