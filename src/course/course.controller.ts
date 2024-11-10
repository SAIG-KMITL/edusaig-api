import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Injectable,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Course } from './course.entity';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dtos/create-course.dto';

@Injectable()
@ApiTags('Courses')
@ApiBearerAuth()
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of courses retrieved successfully',
    type: Course,
    isArray: true,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async findAll(): Promise<Course[]> {
    return this.courseService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific course by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Course ID',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Course retrieved successfully',
    type: Course,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Course not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async findOne(@Param('id') id: string): Promise<Course> {
    return this.courseService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiBody({
    type: Course,
    description: 'Course data to create',
    examples: {
      example1: {
        value: {
          title: 'Introduction to NestJS',
          description: 'Learn the basics of NestJS framework',
          teacherId: '123e4567-e89b-12d3-a456-426614174000',
          thumbnail: 'https://example.com/thumbnail.jpg',
          duration: 120,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Course created successfully',
    type: Course,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid course data provided',
  })
  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, type: Course })
  async create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.courseService.create(createCourseDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing course' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Course ID to update',
    type: 'string',
  })
  @ApiBody({
    type: Course,
    description: 'Updated course data',
    examples: {
      example1: {
        value: {
          title: 'Updated Course Title',
          description: 'Updated course description',
          thumbnail: 'https://example.com/new-thumbnail.jpg',
          duration: 150,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Course updated successfully',
    type: Course,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Course not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid course data provided',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async update(
    @Param('id') id: string,
    @Body() courseData: Partial<Course>,
  ): Promise<Course> {
    return this.courseService.update(id, courseData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a course' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Course ID to delete',
    type: 'string',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Course deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Course not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized access',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.courseService.remove(id);
  }
}
