import { ApiProperty } from '@nestjs/swagger';
import { CourseResponseDto } from 'src/course/dtos';
import { PaginatedResponse } from 'src/shared/pagination/dtos/paginate-response.dto';
import { CourseModule } from '../course-module.entity';

export class CourseModuleResponseDto {
  @ApiProperty({
    description: 'Course Module ID',
    type: String,
    example: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
  })
  id: string;

  @ApiProperty({
    description: 'Course Module title',
    type: String,
    example: 'Introduction to Variables',
  })
  title: string;

  @ApiProperty({
    description: 'Course Module description',
    type: String,
    example: 'Learn about variables and data types in programming',
  })
  description: string;

  @ApiProperty({
    description: 'Course Data',
    type: CourseResponseDto,
    example: {
      id: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
      title: 'Introduction to Programming',
      description: 'This course is an introduction to programming',
      thumbnail: 'https://www.example.com/thumbnail.jpg',
      duration: 60,
      level: 'BEGINNER',
      price: 100,
      status: 'DRAFT',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  })
  course: CourseResponseDto;

  @ApiProperty({
    description: 'Course Module created date',
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Course Module updated date',
    type: Date,
    example: new Date(),
  })
  updatedAt: Date;

  constructor(courseModule: CourseModule) {
    this.id = courseModule.id;
    this.title = courseModule.title;
    this.description = courseModule.description;
    this.course = courseModule.course
      ? new CourseResponseDto(courseModule.course)
      : null;
    this.createdAt = courseModule.createdAt;
    this.updatedAt = courseModule.updatedAt;
  }
}

export class PaginatedCourseModuleResponseDto extends PaginatedResponse(
  CourseModuleResponseDto,
) {
  constructor(
    courseModules: CourseModule[],
    total: number,
    pageSize: number,
    currentPage: number,
  ) {
    const courseModuleDtos = courseModules.map(
      (courseModule) => new CourseModuleResponseDto(courseModule),
    );
    super(courseModuleDtos, total, pageSize, currentPage);
  }
}
