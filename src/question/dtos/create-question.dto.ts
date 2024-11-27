import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { QuestionType } from 'src/shared/enums';
export class CreateQuestionDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Exam ID',
    type: String,
    example: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
  })
  examId: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Question exam',
    type: String,
    example: 'What is this?',
  })
  question: string;

  @IsNotEmpty()
  @IsEnum(QuestionType)
  @ApiProperty({
    description: 'Type question',
    type: String,
    example: QuestionType.TRUE_FALSE,
    enum: QuestionType,
  })
  type: QuestionType;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Points in 1 question',
    type: Number,
    example: 1,
  })
  points: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Order question',
    type: Number,
    example: 1,
  })
  orderIndex?: number;
}

export class CreateQuestionPretestDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Pretest ID',
    type: String,
    example: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
  })
  pretestId: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Question exam',
    type: String,
    example: 'What is this?',
  })
  question: string;

  @IsNotEmpty()
  @IsEnum(QuestionType)
  @ApiProperty({
    description: 'Type question',
    type: String,
    example: QuestionType.PRETEST,
    enum: QuestionType,
  })
  type: QuestionType;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Points in 1 question',
    type: Number,
    example: 1,
  })
  points: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'Order question',
    type: Number,
    example: 1,
  })
  orderIndex?: number;
}
