import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { Role } from 'src/shared/enums';
import { PaginateQueryDto } from 'src/shared/pagination/dtos/paginate-query.dto';
import { CourseModuleService } from './course-module.service';
import {
  CourseModuleResponseDto,
  PaginatedCourseModuleResponseDto,
} from './dtos/course-module-response.dto';
import { CreateCourseModuleDto } from './dtos/create-course-module.dto';
import { UpdateCourseModuleDto } from './dtos/update-course-module.dto';
import { CourseService } from 'src/course/course.service';
import { CourseOwnership } from 'src/shared/decorators/course-ownership.decorator';
import { Roles } from 'src/shared/decorators/role.decorator';

@Controller('course-module')
@ApiTags('Course Modules')
@ApiBearerAuth()
export class CourseModuleController {
  constructor(
    private readonly courseModuleService: CourseModuleService,
    private readonly courseService: CourseService,
  ) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: CourseModuleResponseDto,
    description: 'Get all course modules',
    isArray: true,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    description: 'Search by title',
  })
  async findAll(
    @Req() request: AuthenticatedRequest,
    @Query() query: PaginateQueryDto,
  ): Promise<PaginatedCourseModuleResponseDto> {
    return this.courseModuleService.findAll({
      page: query.page,
      limit: query.limit,
      search: query.search,
      userId: request.user.id,
      role: request.user.role,
    });
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Course Module ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CourseModuleResponseDto,
    description: 'Get a course module',
  })
  async findOne(
    @Req() request: AuthenticatedRequest,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CourseModuleResponseDto> {
    return this.courseModuleService.findOne(
      request.user.id,
      request.user.role,
      { where: { id } },
    );
  }

  @Get('course/:courseId')
  @ApiParam({
    name: 'courseId',
    type: String,
    description: 'Course ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CourseModuleResponseDto,
    description: 'Get course modules by course ID',
    isArray: true,
  })
  async findByCourseId(
    @Req() request: AuthenticatedRequest,
    @Param('courseId', new ParseUUIDPipe()) courseId: string,
  ): Promise<CourseModuleResponseDto[]> {
    await this.courseService.validateOwnership(courseId, request.user.id);
    return this.courseModuleService.findByCourseId(courseId);
  }

  @Post()
  @Roles(Role.TEACHER)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CourseModuleResponseDto,
    description: 'Create a course module',
  })
  async create(
    @Req() request: AuthenticatedRequest,
    @Body() createCourseModuleDto: CreateCourseModuleDto,
  ): Promise<CourseModuleResponseDto> {
    if (createCourseModuleDto.courseId != null) {
      await this.courseService.validateOwnership(
        createCourseModuleDto.courseId,
        request.user.id,
      );
    }

    return this.courseModuleService.create(createCourseModuleDto);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Course Module ID',
  })
  @CourseOwnership({ adminDraftOnly: true })
  async update(
    @Req() request: AuthenticatedRequest,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
    @Body() updateCourseModuleDto: UpdateCourseModuleDto,
  ): Promise<CourseModuleResponseDto> {
    if (updateCourseModuleDto.courseId != null) {
      await this.courseService.validateOwnership(
        updateCourseModuleDto.courseId,
        request.user.id,
      );
    }
    return this.courseModuleService.update(id, updateCourseModuleDto);
  }

  @Delete(':id')
  @CourseOwnership()
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Course Module ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CourseModuleResponseDto,
    description: 'Delete a course module',
  })
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CourseModuleResponseDto> {
    return this.courseModuleService.remove(id);
  }
}
