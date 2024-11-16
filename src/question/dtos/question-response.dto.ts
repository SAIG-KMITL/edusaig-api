import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponse } from 'src/shared/pagination/dtos/paginate-response.dto';
import { Question } from '../question.entity';
import { Exam } from 'src/exam/exam.entity';
import { ExamResponseDto } from 'src/exam/dtos/exam-response.dto';
import { QuestionType } from 'src/shared/enums';

export class QuestionResponseDto {
  @ApiProperty({
    description: 'Question ID',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Exam Data',
    type: ExamResponseDto,
    example: {
      id: 'ce2fd59a-28ea-4192-bfc6-c2347450ab7e',
      courseModuleId: 'b88d68fc-7437-4812-b4f6-e08f18bc09d1',
      title: 'Biology',
      description: 'This course is an introduction to biology',
      timeLimit: 20,
      passingScore: 50,
      maxAttempts: 1,
      shuffleQuestions: true,
      status: 'draft',
    },
  })
  exam: Exam;

  @ApiProperty({
    description: 'Exam question',
    type: String,
    example: 'What is this?',
  })
  question: string;

  @ApiProperty({
    description: 'Type question',
    type: String,
    example: QuestionType.TRUE_FALSE,
    enum: QuestionType,
  })
  type: QuestionType;

  @ApiProperty({
    description: 'Points in 1 question',
    type: Number,
    example: 0,
  })
  points: Number;

  @ApiProperty({
    description: 'Score to pass exam.',
    type: Number,
    example: 1,
  })
  orderIndex: Number;

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

  constructor(question: Question) {
    this.id = question.id;
    this.exam = question.exam;
    this.question = question.question;
    this.type = question.type;
    this.points = question.points;
    this.orderIndex = question.orderIndex;
    this.createdAt = question.createdAt;
    this.updatedAt = question.updatedAt;
  }
}

export class PaginatedQuestionResponseDto extends PaginatedResponse(
  QuestionResponseDto,
) {
  constructor(
    question: Question[],
    total: number,
    pageSize: number,
    currentPage: number,
  ) {
    const questionDtos = question.map(
      (question) => new QuestionResponseDto(question),
    );
    super(questionDtos, total, pageSize, currentPage);
  }
}
