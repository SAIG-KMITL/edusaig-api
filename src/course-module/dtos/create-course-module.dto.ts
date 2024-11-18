import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCourseModuleDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Course Module title',
    type: String,
    example: 'Introduction to Programming',
  })
  title: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Course Module description',
    type: String,
    example: 'This module is an introduction to programming',
  })
  description: string;

  @IsNotEmpty()
  @IsUUID(4)
  @ApiProperty({
    description: 'Course ID',
    type: String,
    example: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
  })
  courseId: string;
}
