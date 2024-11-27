import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponse } from 'src/shared/pagination/dtos/paginate-response.dto';
import { Question } from '../question.entity';
import { QuestionType } from 'src/shared/enums';
import { Pretest } from 'src/pretest/pretest.entity';
import { PretestResponseDto } from 'src/pretest/dtos/pretest-response.dto';

export class QuestionPretestResponseDto {
  @ApiProperty({
    description: 'Question ID',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Pretest Data',
    type: PretestResponseDto,
    example: {
      id: '80ff2ec3-7c6d-4427-a98d-58ac3aa68697',
      user: {
        id: 'a12e1e37-3504-4711-a389-09a1734d7b1c',
        username: 'johndoe',
        fullname: 'John Doe',
        role: 'student',
        email: 'johndoe@gmail.com',
        profileKey: null,
      },
      title: 'Biology',
      description: 'This course is an introduction to biology',
      timeLimit: 20,
      passingScore: 3,
      maxAttempts: 1,
    },
  })
  pretest: Pretest;

  @ApiProperty({
    description: 'Pretest question',
    type: String,
    example: 'What is this?',
  })
  question: string;

  @ApiProperty({
    description: 'Type question pretest',
    type: String,
    example: QuestionType.PRETEST,
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
    description: 'Index in exam.',
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
    this.pretest = question.pretest;
    this.question = question.question;
    this.type = question.type;
    this.points = question.points;
    this.orderIndex = question.orderIndex;
    this.createdAt = question.createdAt;
    this.updatedAt = question.updatedAt;
  }
}

export class PaginatedQuestionPretestResponseDto extends PaginatedResponse(
  QuestionPretestResponseDto,
) {
  constructor(
    question: Question[],
    total: number,
    pageSize: number,
    currentPage: number,
  ) {
    const questionDtos = question.map(
      (question) => new QuestionPretestResponseDto(question),
    );
    super(questionDtos, total, pageSize, currentPage);
  }
}
