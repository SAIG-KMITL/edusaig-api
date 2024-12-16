import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateQuestionOptionDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Question ID',
    type: String,
    example: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
  })
  questionId: string;
  @IsNotEmpty()
  @ApiProperty({
    description: 'Question option text',
    type: String,
    example: 'A. Rock',
  })
  optionText: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({
    description: 'Is this question option correct?',
    type: Boolean,
    example: false,
  })
  isCorrect: boolean;

  @IsNotEmpty()
  @ApiProperty({
    description: 'ehy this question option correct or incorrect?',
    type: String,
    example: 'Rock is not biology.',
  })
  explanation: string;
}
