import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { ExamAnswer } from './exam-answer.entity';
import { ExamAttemptController } from 'src/exam-attempt/exam-attempt.controller';
import { examAnswerProviders } from './exam-answer.providers';
import { ExamAnswerService } from './exam-answer.service';
import { ExamAnswerController } from './exam-answer.controller';
import { ExamAttempt } from 'src/exam-attempt/exam-attempt.entity';
import { Question } from 'src/question/question.entity';
import { QuestionOption } from 'src/question-option/question-option.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([
      ExamAnswer,
      ExamAttempt,
      Question,
      QuestionOption,
      User,
    ]),
  ],
  controllers: [ExamAnswerController],
  providers: [...examAnswerProviders, ExamAnswerService],
  exports: [ExamAnswerService],
})
export class ExamAnswerModule {}
