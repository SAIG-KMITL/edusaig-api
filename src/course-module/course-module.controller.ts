import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Injectable,
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
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/enums';
import { PaginateQueryDto } from 'src/shared/pagination/dtos/paginate-query.dto';
import { CourseModuleService } from './course-module.service';
import {
  CourseModuleResponseDto,
  PaginatedCourseModuleResponseDto,
} from './dtos/course-module-response.dto';
import { CreateCourseModuleDto } from './dtos/create-course-module.dto';
import { UpdateCourseModuleDto } from './dtos/update-course-module.dto';
import { CourseOwnership } from 'src/shared/decorators/course-ownership.decorator';

@Controller('course-module')
@ApiTags('Course Modules')
@ApiBearerAuth()
@Injectable()
export class CourseModuleController {
  constructor(private readonly courseModuleService: CourseModuleService) { }

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
    @Query() query: PaginateQueryDto,
  ): Promise<PaginatedCourseModuleResponseDto> {
    return this.courseModuleService.findAll({
      page: query.page,
      limit: query.limit,
      search: query.search,
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
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CourseModuleResponseDto> {
    return this.courseModuleService.findOne(id, {
      where: { id },
    });
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
    @Param('courseId', new ParseUUIDPipe()) courseId: string,
  ): Promise<CourseModuleResponseDto[]> {
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
    @Body() createCourseModuleDto: CreateCourseModuleDto,
  ): Promise<CourseModuleResponseDto> {
    return this.courseModuleService.create(createCourseModuleDto);
  }

  @Patch(':id')
  @CourseOwnership({
    adminDraftOnly: true
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Course Module ID',
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateCourseModuleDto: UpdateCourseModuleDto,
  ): Promise<CourseModuleResponseDto> {
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
