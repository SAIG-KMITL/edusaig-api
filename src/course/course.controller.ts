import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  ParseFilePipeBuilder,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { CategoryService } from 'src/category/category.service';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/enums';
import { PaginateQueryDto } from 'src/shared/pagination/dtos/paginate-query.dto';
import { CourseService } from './course.service';
import {
  CourseResponseDto,
  CreateCourseDto,
  PaginatedCourseResponeDto,
  UpdateCourseDto,
} from './dtos/index';
import { CourseOwnership } from 'src/shared/decorators/course-ownership.decorator';
import { Public } from 'src/shared/decorators/public.decorator';
import { FileService } from 'src/file/file.service';
import { Folder } from 'src/file/enums/folder.enum';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('course')
@ApiTags('Course')
@Injectable()
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly categoryService: CategoryService,
    private readonly fileService: FileService,
  ) {}

  @Get(':id/thumbnail')
  @Public()
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Course id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get course thumbnail',
    type: StreamableFile,
  })
  async getThumbnail(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ): Promise<StreamableFile> {
    const course = await this.courseService.findOne({
      where: { id },
    });
    const file = await this.fileService.get(Folder.COURSE_THUMBNAILS, course.thumbnailKey);
    return new StreamableFile(file, {
      disposition: 'inline',
      type: `image/${course.thumbnailKey.split('.').pop()}`,
    });
  }



  @Patch(':id/thumbnail')
  @CourseOwnership({ adminDraftOnly: true })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Thumbnail updated successfully',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Course id',
  })
  async uploadThumbnail(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image/*' })
        .build({
          fileIsRequired: true,
          errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        }),
    )
    file: Express.Multer.File,
  ): Promise<void> {
    const course = await this.courseService.findOne({
      where: { id },
    });
    if (course.thumbnailKey)
      await this.fileService.update(Folder.COURSE_THUMBNAILS, course.thumbnailKey, file); 
    else {
      await this.fileService.upload(Folder.COURSE_THUMBNAILS, id, file);
    }
    await this.courseService.update(id, { thumbnailKey: `${id}.${file.originalname.split('.').pop()}` });  
  }


  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: CourseResponseDto,
    description: 'Get all course by',
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
    description: 'Search by email',
  })
  @ApiBearerAuth()
  async findAll(
    @Req() request: AuthenticatedRequest,
    @Query() query: PaginateQueryDto,
  ): Promise<PaginatedCourseResponeDto> {
    return this.courseService.findAll({
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
    description: 'Course id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CourseResponseDto,
    description: 'Get course by id',
  })
  async findOne(
    @Req() request: AuthenticatedRequest,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ): Promise<CourseResponseDto> {
    const course = await this.courseService.findOneWithOwnership(
      request.user.id,
      request.user.role,
      { where: { id } },
    );
    return new CourseResponseDto(course);
  }

  @Post()
  @Roles(Role.TEACHER)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CourseResponseDto,
    description: 'Create course',
  })
  async create(
    @Req() request: AuthenticatedRequest,
    @Body() createCourseDto: CreateCourseDto,
  ) {
    const category = await this.categoryService.findOne({
      where: { id: createCourseDto.categoryId },
    });

    if (!category) {
      throw new BadRequestException('Category not found');
    }
    const course = await this.courseService.create(
      request.user.id,
      createCourseDto,
    );

    return course;
  }

  @Patch(':id')
  @CourseOwnership({ adminDraftOnly: true })
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Course id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CourseResponseDto,
    description: 'Update course by id',
  })
  async update(
    @Req() request: AuthenticatedRequest,
    @Body() updateCourseDto: UpdateCourseDto,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ): Promise<CourseResponseDto> {
    const category = await this.categoryService.findOne({
      where: { id: updateCourseDto.categoryId },
    });

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    const course = await this.courseService.update(id, updateCourseDto);

    return new CourseResponseDto(course);
  }
  @Delete(':id')
  @CourseOwnership()
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Course id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete course by id',
  })
  @ApiBearerAuth()
  async delete(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ): Promise<void> {
    await this.courseService.delete(id);
  }
}
