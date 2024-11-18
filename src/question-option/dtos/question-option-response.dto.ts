import { ApiProperty } from '@nestjs/swagger';
import { QuestionOption } from '../question-option.entity';
import { PaginatedResponse } from 'src/shared/pagination/dtos/paginate-response.dto';
import { Question } from 'src/question/question.entity';

export class QuestionOptionResponseDto {
  @ApiProperty({
    description: 'Question option ID',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Question Data',
    type: Question,
    example: {
      id: '3a3013bb-b13c-40f0-be93-1ff7ad3e36f0',
      question: 'What the fick?',
      type: 'Open question',
      points: 0,
      orderIndex: 1,
    },
  })
  question: Question;

  @ApiProperty({
    description: 'Question option text',
    type: String,
    example: 'A. Rock',
  })
  optionText: string;

  @ApiProperty({
    description: 'Is this question option correct?',
    type: Boolean,
    example: false,
  })
  isCorrect: boolean;

  @ApiProperty({
    description: 'ehy this question option correct or incorrect?',
    type: String,
    example: 'Rock is not biology.',
  })
  explanation: string;

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

  constructor(questionOption: QuestionOption) {
    this.id = questionOption.id;
    this.question = questionOption.question;
    this.optionText = questionOption.optionText;
    this.isCorrect = questionOption.isCorrect;
    this.explanation = questionOption.explanation;
    this.createdAt = questionOption.createdAt;
    this.updatedAt = questionOption.updatedAt;
  }
}

export class PaginatedQuestionOptionResponseDto extends PaginatedResponse(
  QuestionOptionResponseDto,
) {
  constructor(
    questionOption: QuestionOption[],
    total: number,
    pageSize: number,
    currentPage: number,
  ) {
    const questionOptionDtos = questionOption.map(
      (questionOption) => new QuestionOptionResponseDto(questionOption),
    );
    super(questionOptionDtos, total, pageSize, currentPage);
  }
}
