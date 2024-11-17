import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ChapterModule } from './chapter/chapter.module';
import { CourseModuleModule } from './course-module/course-module.module';
import { CourseModule } from './course/course.module';
import { DatabaseModule } from './database/database.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { ExamAttemptModule } from './exam-attempt/exam-attempt.module';
import { ExamModule } from './exam/exam.module';
import { FileModule } from './file/file.module';
import { ProgressModule } from './progress/progress.module';
import { QuestionOptionModule } from './question-option/question-option.module';
import { QuestionModule } from './question/question.module';
import { databaseConfig } from './shared/configs/database.config';
import { dotenvConfig } from './shared/configs/dotenv.config';
import { GLOBAL_CONFIG } from './shared/constants/global-config.constant';
import { RolesGuard } from './shared/guards/role.guard';
import { UserOccupationModule } from './user-occupation/user-occupation.module';
import { UserStreak } from './user-streak/user-streak.entity';
import { UserStreakModule } from './user-streak/user-streak.module';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';

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
        migrations: ['dist/database/migrations/*.js'],
        migrationsRun: true,
        synchronize: configService.get<boolean>(GLOBAL_CONFIG.IS_DEVELOPMENT),
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    JwtModule.register({
      global: true,
    }),
    DatabaseModule,
    UserModule,
    UserStreakModule,
    CategoryModule,
    CourseModule,
    CourseModuleModule,
    ChapterModule,
    FileModule,
    ExamModule,
    EnrollmentModule,
    ProgressModule,
    ExamAttemptModule,
    QuestionModule,
    QuestionOptionModule,
    UserOccupationModule,
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
    },
  ],
})
export class AppModule {}
