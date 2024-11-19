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
      id: 'e20ffe51-2514-4f14-9bea-4bb28bb97fdd',
      title: 'Biology',
      description: 'This course is an introduction to biology',
      timeLimit: 20,
      passingScore: 50,
      maxAttempts: 1,
      shuffleQuestions: false,
      status: 'published',
      courseModule: {
        id: '7093a5ae-cc1d-4017-8445-cba7ea978b22',
        course: {
          id: 'b7634715-9536-46be-ae06-650dc0d719fb',
          teacher: {
            id: '75af7b82-d765-40a3-82aa-bc4f572c492c',
          },
        },
      },
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
