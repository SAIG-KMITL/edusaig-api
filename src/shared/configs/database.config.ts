import { ConfigService } from '@nestjs/config';
import 'dotenv/config';
import { Category } from 'src/category/category.entity';
import { Chapter } from 'src/chapter/chapter.entity';
import { CourseModule } from 'src/course-module/course-module.entity';
import { Course } from 'src/course/course.entity';
import { Enrollment } from 'src/enrollment/enrollment.entity';
import { Exam } from 'src/exam/exam.entity';
import { Progress } from 'src/progress/progress.entity';
import { UserStreak } from 'src/user-streak/user-streak.entity';
import { User } from 'src/user/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { GLOBAL_CONFIG } from '../constants/global-config.constant';

const configService = new ConfigService();

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>(GLOBAL_CONFIG.DB_HOST),
  port: configService.get<number>(GLOBAL_CONFIG.DB_PORT),
  username: configService.get<string>(GLOBAL_CONFIG.DB_USERNAME),
  password: configService.get<string>(GLOBAL_CONFIG.DB_PASSWORD),
  database: configService.get<string>(GLOBAL_CONFIG.DB_DATABASE),
  logging: configService.get<boolean>(GLOBAL_CONFIG.IS_DEVELOPMENT),
  entities: [
    User,
    UserStreak,
    Category,
    Course,
    CourseModule,
    Chapter,
    Enrollment,
    Exam,
    Progress,
  ],
};

export default new DataSource(databaseConfig);
