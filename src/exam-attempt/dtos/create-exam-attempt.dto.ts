import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { ExamAttemptStatus } from 'src/shared/enums';

export class CreateExamAttemptDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Exam ID',
    type: String,
    example: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
  })
  examId: string;

  @IsOptional()
  @Min(0)
  @IsInt()
  @ApiProperty({
    description: 'Score',
    type: Number,
    example: 0,
  })
  score?: number;

  @IsNotEmpty()
  @IsEnum(ExamAttemptStatus)
  @ApiProperty({
    description: 'Exam attempt status',
    type: String,
    example: ExamAttemptStatus.IN_PROGRESS,
    enum: ExamAttemptStatus,
  })
  status: ExamAttemptStatus;
}

export class CreateExamAttemptPretestDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Pretest ID',
    type: String,
    example: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
  })
  pretestId: string;

  @IsOptional()
  @Min(0)
  @IsInt()
  @ApiProperty({
    description: 'Score',
    type: Number,
    example: 0,
  })
  score?: number;

  @IsNotEmpty()
  @IsEnum(ExamAttemptStatus)
  @ApiProperty({
    description: 'Exam attempt status',
    type: String,
    example: ExamAttemptStatus.IN_PROGRESS,
    enum: ExamAttemptStatus,
  })
  status: ExamAttemptStatus;
}
