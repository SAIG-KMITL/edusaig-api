import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'src/database/database.module';
import { QuestionOption } from './question-option.entity';
import { Module } from '@nestjs/common';
import { QuestionOptionController } from './question-option.controller';
import { questionOptionProviders } from './question-option.providers';
import { QuestionOptionService } from './question-option.service';
import { Question } from 'src/question/question.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([QuestionOption, Question]),
  ],
  controllers: [QuestionOptionController],
  providers: [...questionOptionProviders, QuestionOptionService],
  exports: [QuestionOptionService],
})
export class QuestionOptionModule {}
