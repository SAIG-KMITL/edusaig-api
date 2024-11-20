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
      id: 'e20ffe51-2514-4f14-9bea-4bb28bb97fdd',
      courseModuleId: '7093a5ae-cc1d-4017-8445-cba7ea978b22',
      courseModule: {
        id: '7093a5ae-cc1d-4017-8445-cba7ea978b22',
        courseId: 'b7634715-9536-46be-ae06-650dc0d719fb',
        course: {
          id: 'b7634715-9536-46be-ae06-650dc0d719fb',
          teacher: {
            id: '75af7b82-d765-40a3-82aa-bc4f572c492c',
          },
        },
      },
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
