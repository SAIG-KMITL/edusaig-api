import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { Pretest } from './pretest.entity';
import { PretestController } from './pretest.controller';
import { pretestProviders } from './pretest.providers';
import { PretestService } from './pretest.service';
import { User } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { UserBackgroundModule } from 'src/user-background/user-background.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { QuestionModule } from 'src/question/question.module';
import { QuestionOptionModule } from 'src/question-option/question-option.module';
import { ExamAnswerModule } from 'src/exam-answer/exam-answer.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Pretest, User]),
    UserBackgroundModule,
    HttpModule,
    ConfigModule,
    QuestionModule,
    QuestionOptionModule,
    ExamAnswerModule,
  ],
  controllers: [PretestController],
  providers: [...pretestProviders, PretestService],
  exports: [PretestService],
})
export class PretestModule {}
