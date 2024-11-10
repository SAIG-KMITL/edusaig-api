import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUrl, IsUUID } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    description: 'The title of the course',
    example: 'Introduction to NestJS',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the course',
    example: 'Learn the fundamentals of NestJS framework',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The ID of the teacher',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  teacherId: string;

  @ApiProperty({
    description: 'URL of the course thumbnail',
    example: 'https://example.com/thumbnail.jpg',
  })
  @IsUrl()
  @IsNotEmpty()
  thumbnail: string;

  @ApiProperty({
    description: 'Duration of the course in minutes',
    example: 120,
  })
  @IsNumber()
  @IsNotEmpty()
  duration: number;
}
