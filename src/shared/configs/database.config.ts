import { ConfigService } from '@nestjs/config';
import 'dotenv/config';
import { Category } from 'src/category/category.entity';
import { Chapter } from 'src/chapter/chapter.entity';
import { ChatMessage } from 'src/chat-message/chat-message.entity';
import { ChatRoom } from 'src/chat-room/chat-room.entity';
import { CourseModule } from 'src/course-module/course-module.entity';
import { Course } from 'src/course/course.entity';
import { Enrollment } from 'src/enrollment/enrollment.entity';
import { ExamAnswer } from 'src/exam-answer/exam-answer.entity';
import { ExamAttempt } from 'src/exam-attempt/exam-attempt.entity';
import { Exam } from 'src/exam/exam.entity';
import { Progress } from 'src/progress/progress.entity';
import { QuestionOption } from 'src/question-option/question-option.entity';
import { Question } from 'src/question/question.entity';
import { Reward } from 'src/reward/reward.entity';
import { Roadmap } from 'src/roadmap/roadmap.entity';
import { UserBackgroundTopic } from 'src/user-background-topic/user-background-topic.entity';
import { UserBackground } from 'src/user-background/user-background.entity';
import { UserOccupation } from 'src/user-occupation/user-occupation.entity';
import { UserStreak } from 'src/user-streak/user-streak.entity';
import { User } from 'src/user/user.entity';
import { UserReward } from 'src/userReward/user-reward.entity';
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
    Reward,
    UserReward,
    Enrollment,
    Exam,
    Progress,
    ExamAttempt,
    Question,
    QuestionOption,
    ExamAnswer,
    UserOccupation,
    UserBackgroundTopic,
    UserBackground,
    ChatRoom,
    ChatMessage,
    Roadmap,
  ],
};

export default new DataSource(databaseConfig);
