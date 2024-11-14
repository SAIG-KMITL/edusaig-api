import {
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
import { ChapterService } from './chapter.service';
import {
  ChapterResponseDto,
  PaginatedChapterResponseDto,
} from './dtos/chapter-response.dto';
import { CreateChapterDto } from './dtos/create-chapter.dto';
import { UpdateChapterDto } from './dtos/update-chapter.dto';
import { CourseOwnership } from 'src/shared/decorators/course-ownership.decorator';

@Controller('chapter')
@ApiTags('Chapters')
@ApiBearerAuth()
@Injectable()
export class ChapterController {
  constructor(private readonly chapterService: ChapterService) {}

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
  async findAll(
    @Query() query: PaginateQueryDto,
  ): Promise<PaginatedChapterResponseDto> {
    return this.chapterService.findAll(query);
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
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ChapterResponseDto> {
    return this.chapterService.findOne(id, { where: { id } });
  }

  @Post()
  @Roles(Role.TEACHER)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ChapterResponseDto,
    description: 'Create a chapter',
  })
  async create(
    @Body() createChapterDto: CreateChapterDto,
  ): Promise<ChapterResponseDto> {
    return this.chapterService.create(createChapterDto);
  }

  @Patch(':id')
  @CourseOwnership({adminDraftOnly: true})
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
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateChapterDto: UpdateChapterDto,
  ): Promise<ChapterResponseDto> {
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
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ChapterResponseDto> {
    return this.chapterService.remove(id);
  }
}


