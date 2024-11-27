import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './question.entity';
import { DatabaseModule } from 'src/database/database.module';
import { questionProviders } from './question.providers';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { Exam } from 'src/exam/exam.entity';
import { Pretest } from 'src/pretest/pretest.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Question, Exam, Pretest]),
  ],
  controllers: [QuestionController],
  providers: [...questionProviders, QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
