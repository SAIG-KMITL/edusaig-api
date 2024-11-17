import { ApiProperty } from '@nestjs/swagger';
import { ExamAnswer } from '../exam-answer.entity';
import { PaginatedResponse } from 'src/shared/pagination/dtos/paginate-response.dto';
import { ExamAttempt } from 'src/exam-attempt/exam-attempt.entity';
import { Question } from 'src/question/question.entity';
import { QuestionOption } from 'src/question-option/question-option.entity';

export class ExamAnswerResponseDto {
  @ApiProperty({
    description: 'Exam Answer ID',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Exam Attempt Data',
    type: ExamAttempt,
    example: { id: '123e4567-e89b-12d3-a456-426614174000' },
  })
  examAttempt: ExamAttempt;

  @ApiProperty({
    description: 'Question Data',
    type: Question,
    example: { id: '123e4567-e89b-12d3-a456-426614174000' },
  })
  question: Question;

  @ApiProperty({
    description: 'Select Question Data',
    type: QuestionOption,
    example: { id: '123e4567-e89b-12d3-a456-426614174000' },
  })
  selectedOption: QuestionOption;

  @ApiProperty({
    description: 'Answer text',
    type: String,
    example: 'biology',
  })
  answerText: string;

  @ApiProperty({
    description: 'Is answer correct?',
    type: Boolean,
    example: false,
  })
  isCorrect: boolean;

  @ApiProperty({
    description: 'Points in this answer',
    type: Number,
    example: 0,
  })
  points: number = 0;

  @ApiProperty({
    description: 'Exam created date',
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Exam updated date',
    type: Date,
    example: new Date(),
  })
  updatedAt: Date;

  constructor(examAnswer: ExamAnswer) {
    this.id = examAnswer.id;
    this.isCorrect = examAnswer.isCorrect;
    this.points = examAnswer.points;
    this.createdAt = examAnswer.createdAt;
    this.updatedAt = examAnswer.updatedAt;
  }
}

export class PaginatedExamAnswerResponseDto extends PaginatedResponse(
  ExamAnswerResponseDto,
) {
  constructor(
    examAnswer: ExamAnswer[],
    total: number,
    pageSize: number,
    currentPage: number,
  ) {
    const examAnswerDtos = examAnswer.map(
      (examAnswer) => new ExamAnswerResponseDto(examAnswer),
    );
    super(examAnswerDtos, total, pageSize, currentPage);
  }
}
