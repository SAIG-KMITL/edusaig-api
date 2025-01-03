import { ApiProperty } from '@nestjs/swagger';

export class AnswerAiDto {
  @ApiProperty({
    description: 'A answer',
    type: String,
    example: 'import',
  })
  a: string;

  @ApiProperty({
    description: 'B answer',
    type: String,
    example: 'hi',
  })
  b: string;

  @ApiProperty({
    description: 'C answer',
    type: String,
    example: 'hello',
  })
  c: string;

  @ApiProperty({
    description: 'D answer',
    type: String,
    example: 'delete',
  })
  d: string;
}

export class QuestionAiDto {
  @ApiProperty({
    description: 'The question text',
    type: String,
    example: 'What is this?',
  })
  question: string;

  @ApiProperty({
    description: 'Answer options for the question',
    type: AnswerAiDto,
    example: {
      a: 'import',
      b: 'hi',
      c: 'hello',
      d: 'delete',
    },
  })
  choices: AnswerAiDto;

  @ApiProperty({
    description: 'The correct answer',
    type: String,
    example: 'c',
  })
  answer: string;
}

export class PretestDto {
  @ApiProperty({
    description: 'All data',
    type: [QuestionAiDto],
    example: [
      {
        question: 'What is this?',
        choices: {
          a: 'import',
          b: 'hi',
          c: 'hello',
          d: 'delete',
        },
        answer: 'c',
      },
    ],
  })
  data: QuestionAiDto[];
}