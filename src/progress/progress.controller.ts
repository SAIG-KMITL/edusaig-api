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
import { CreateProgressDto } from './dtos/create-progress.dto';
import {
  PaginatedProgressResponseDto,
  ProgressResponseDto,
} from './dtos/progress-response.dto';
import { UpdateProgressDto } from './dtos/update-progress.dto';
import { ProgressService } from './progress.service';

@Controller('progress')
@ApiTags('Progress')
@ApiBearerAuth()
@Injectable()
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProgressResponseDto,
    description: 'Get all progress',
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
  ): Promise<PaginatedProgressResponseDto> {
    return this.progressService.findAll(query);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Progress ID',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProgressResponseDto> {
    return this.progressService.findOne(id, { where: { id } });
  }

  @Post()
  @Roles(Role.STUDENT)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ProgressResponseDto,
    description: 'Create a progress',
  })
  async create(
    @Body() createProgressDto: CreateProgressDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ProgressResponseDto> {
    return this.progressService.create(createProgressDto);
  }

  @Patch(':id')
  @Roles(Role.STUDENT)
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Progress ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProgressResponseDto,
    description: 'Update a progress',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProgressDto: UpdateProgressDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ProgressResponseDto> {
    return this.progressService.update(id, updateProgressDto);
  }

  @Delete(':id')
  @Roles(Role.STUDENT)
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Progress ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProgressResponseDto,
    description: 'Delete a progress',
  })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<ProgressResponseDto> {
    return this.progressService.remove(id);
  }
}
