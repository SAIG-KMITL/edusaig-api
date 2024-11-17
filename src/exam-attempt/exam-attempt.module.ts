import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamAttempt } from './exam-attempt.entity';
import { ExamAttemptController } from './exam-attempt.controller';
import { examAttemptProviders } from './exam-attempt.providers';
import { ExamAttemptService } from './exam-attempt.service.dto';
import { Exam } from 'src/exam/exam.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([ExamAttempt, Exam, User]),
  ],
  controllers: [ExamAttemptController],
  providers: [...examAttemptProviders, ExamAttemptService],
  exports: [ExamAttemptService],
})
export class ExamAttemptModule {}
