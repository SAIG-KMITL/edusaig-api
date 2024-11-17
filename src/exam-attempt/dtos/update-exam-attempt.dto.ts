import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';
import { ExamAttemptStatus } from 'src/shared/enums';

export class UpdateExamAttemptDto {
  @IsNotEmpty()
  @Min(0)
  @IsInt()
  @ApiProperty({
    description: 'Score',
    type: Number,
    example: 0,
  })
  score: number = 0;

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
