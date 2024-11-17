import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateExamAnswerDto {
  @IsOptional()
  @ApiProperty({
    description: 'Exam Attempt ID',
    type: String,
    example: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
  })
  examAttemptId?: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Select Question ID',
    type: String,
    example: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
  })
  selectedOptionId: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Answer text',
    type: String,
    example: 'biology',
  })
  answerText: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: 'Is answer correct?',
    type: Boolean,
    example: false,
  })
  isCorrect: boolean;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    description: 'Points in this answer',
    type: Number,
    example: 0,
  })
  points: number = 0;
}
