import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { ExamAnswer } from './exam-answer.entity';
import { ExamAttemptController } from 'src/exam-attempt/exam-attempt.controller';
import { examAnswerProviders } from './exam-answer.providers';
import { ExamAnswerService } from './exam-answer.service';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([ExamAnswer])],
  controllers: [ExamAttemptController],
  providers: [...examAnswerProviders, ExamAnswerService],
  exports: [ExamAnswerService],
})
export class ExamAnswerModule {}
