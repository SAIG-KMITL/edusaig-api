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
  UseGuards,
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
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/enums';
import { PaginateQueryDto } from 'src/shared/pagination/dtos/paginate-query.dto';
import { ChapterService } from './chapter.service';
import {
  ChapterResponseDto,
  PaginatedChapterResponseDto,
} from './dtos/chapter-response.dto';
import { CreateChapterDto } from './dtos/create-chapter.dto';
import { UpdateChapterDto } from './dtos/update-chapter.dto';
import { CourseOwnership } from 'src/shared/decorators/course-ownership.decorator';
import { CourseModuleService } from 'src/course-module/course-module.service';
import { ChatRoomResponseDto } from 'src/chat-room/dtos';
import { ChatRoomService } from 'src/chat-room/chat-room.service';
import { FileService } from 'src/file/file.service';
import { Folder } from 'src/file/enums/folder.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { EnrollmentService } from 'src/enrollment/enrollment.service';
import { Public } from 'src/shared/decorators/public.decorator';

@Controller('chapter')
@ApiTags('Chapters')
@Injectable()
export class ChapterController {
  constructor(
    private readonly chapterService: ChapterService,
    private readonly courseModuleService: CourseModuleService,
    private readonly fileService: FileService,
    private readonly enrollmentService: EnrollmentService,
  ) { }

  @Get(':id/video')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Course id',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get chapter video',
    type: StreamableFile,
  })
  async getVideo(
    @Req() request: AuthenticatedRequest,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ): Promise<StreamableFile> {
    const chapter = await this.chapterService.findOneWithOwnership(
      request.user.id,
      request.user.role,
      { where: { id } },
    );

    const file = await this.fileService.get(Folder.CHAPTER_VIDEOS, chapter.videoKey);
    return new StreamableFile(file, {
      disposition: 'inline',
      type: `video/${chapter.videoKey.split('.').pop()}`,
    });
  }



  @Patch(':id/video')
  @CourseOwnership({ adminDraftOnly: true })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Video updated successfully',
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
    description: 'Chapter id',
  })
  async uploadVideo(
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
        .addFileTypeValidator({ fileType: 'video/*' })
        .build({
          fileIsRequired: true,
          errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        }),
    )
    file: Express.Multer.File,
  ): Promise<void> {
    const chapter = await this.chapterService.findOne({
      where: { id },
    });
    if (chapter.videoKey)
      await this.fileService.update(Folder.CHAPTER_VIDEOS, chapter.videoKey, file);
    else {
      await this.fileService.upload(Folder.CHAPTER_VIDEOS, id, file);
    }
    await this.chapterService.update(id, { videoKey: `${id}.${file.originalname.split('.').pop()}` });
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: ChapterResponseDto,
    description: 'Get all chapters',
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
  @Public()
  async findAll(
    @Query() query: PaginateQueryDto,
  ): Promise<PaginatedChapterResponseDto> {
    return this.chapterService.findAll({
      page: query.page,
      limit: query.limit,
      search: query.search
    });
  }
  @Get('module/:moduleId')
  @ApiParam({
    name: 'moduleId',
    type: String,
    description: 'Module ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ChapterResponseDto,
    description: 'Get all chapters by module id',
    isArray: true,
  })
  @Public()
  async findByModuleId(
    @Param('moduleId', ParseUUIDPipe) moduleId: string,
  ): Promise<ChapterResponseDto[]> {
    return this.chapterService.findByModuleId(moduleId);
  }

  @Get('with-ownership')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ChapterResponseDto,
    description: 'Get all chapters with ownership',
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
  @ApiBearerAuth()
  async findAllWithOwnership(
    @Req() request: AuthenticatedRequest,
    @Query() query: PaginateQueryDto,
  ): Promise<PaginatedChapterResponseDto> {
    return this.chapterService.findAllWithOwnership({
      page: query.page,
      limit: query.limit,
      search: query.search,
      userId: request.user.id,
      role: request.user.role,
    });
  }
  @Get('with-ownership/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ChapterResponseDto,
    description: 'Get a chapter by ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Chapter ID',
  })
  @ApiBearerAuth()
  async findOneWithOwnership(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ChapterResponseDto> {
    return this.chapterService.findOneWithOwnership(request.user.id, request.user.role, {
      where: { id },
    });
  }




  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ChapterResponseDto,
    description: 'Get a chapter by ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Chapter ID',
  })
  @Public()
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ChapterResponseDto> {
    return this.chapterService.findOne({ where: { id, isPreview: true } });
  }

  @Get(':id/chat-rooms')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ChatRoomResponseDto,
    description: 'Get all chat rooms for a chapter',
    isArray: true,
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Chapter ID',
  })
  @Roles(Role.STUDENT)
  @ApiBearerAuth()
  async getChatRooms(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ChatRoomResponseDto[]> {
    const chatRooms = await this.chapterService.getChatRooms(
      request.user.id,
      id,
    );
    return chatRooms.map((chatRoom) => new ChatRoomResponseDto(chatRoom));
  }


  @Post()
  @Roles(Role.TEACHER)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ChapterResponseDto,
    description: 'Create a chapter',
  })
  @ApiBearerAuth()
  async create(
    @Req() request: AuthenticatedRequest,
    @Body() createChapterDto: CreateChapterDto,
  ): Promise<ChapterResponseDto> {
    if (createChapterDto.moduleId != null) {
      await this.courseModuleService.validateOwnership(
        createChapterDto.moduleId,
        request.user.id,
      );
    }
    return this.chapterService.create(createChapterDto);
  }

  @Patch(':id')
  @CourseOwnership({ adminDraftOnly: true })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ChapterResponseDto,
    description: 'Update a chapter',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Chapter ID',
  })
  @ApiBearerAuth()
  async update(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateChapterDto: UpdateChapterDto,
  ): Promise<ChapterResponseDto> {
    if (updateChapterDto.moduleId != null) {
      await this.courseModuleService.validateOwnership(
        updateChapterDto.moduleId,
        request.user.id,
      );
    }
    return this.chapterService.update(id, updateChapterDto);
  }

  @Delete(':id')
  @CourseOwnership()
  @ApiResponse({
    status: HttpStatus.OK,
    type: ChapterResponseDto,
    description: 'Delete a chapter',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Chapter ID',
  })
  @ApiBearerAuth()
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ChapterResponseDto> {
    return this.chapterService.remove(id);
  }
}
