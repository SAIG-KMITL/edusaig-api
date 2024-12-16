import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCourseModuleDto } from './create-course-module.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateCourseModuleDto extends PartialType(CreateCourseModuleDto) {
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Course Module order index',
    type: Number,
    example: 1,
  })
  orderIndex?: number;
}
