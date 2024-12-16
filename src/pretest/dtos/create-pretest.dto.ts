import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
export class CreatePretestDto {
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
  timeLimit: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    description: 'Score to pass exam.',
    type: Number,
    example: 3,
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
}
