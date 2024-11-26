import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ExamStatus } from 'src/shared/enums';
export class CreateExamDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Course Module ID',
    type: String,
    example: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
  })
  courseModuleId: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Exam title',
    type: String,
    example: 'Biology',
  })
  title: string;

  @IsOptional()
  @ApiProperty({
    description: 'Exam description',
    type: String,
    example: 'This course is an introduction to biology',
  })
  description?: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    description: 'time limit to do exam.',
    type: Number,
    example: 20,
  })
  timeLimit: number = 20;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    description: 'Score to pass exam.',
    type: Number,
    example: 50,
  })
  passingScore: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    description: 'Max attempts to do exam.',
    type: Number,
    example: 1,
  })
  maxAttempts: number;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Shuffle question.',
    type: Boolean,
    example: false,
  })
  shuffleQuestions?: boolean;

  @IsOptional()
  @IsEnum(ExamStatus)
  @ApiProperty({
    description: 'Exam status',
    type: String,
    example: ExamStatus.DRAFT,
    enum: ExamStatus,
  })
  status?: ExamStatus;
}
