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
import { CreateUserBackgroundTopicDto } from './dtos/create-user-background-topic.dto';
import { UpdateUserBackgroundTopicDto } from './dtos/update-user-background-topic.dto';
import {
  PaginatedUserBackgroundTopicResponseDto,
  UserBackgroundTopicResponseDto,
} from './dtos/user-background-response.dto';
import { UserBackgroundTopicService } from './user-background-topic.service';

@Controller('user-background-topic')
@ApiTags('User Background Topic')
@ApiBearerAuth()
@Injectable()
export class UserBackgroundTopicController {
  constructor(
    private readonly userBackgroundTopicService: UserBackgroundTopicService,
  ) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserBackgroundTopicResponseDto,
    description: 'Get all user background topics',
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
    @Query() { page, limit }: PaginateQueryDto,
  ): Promise<PaginatedUserBackgroundTopicResponseDto> {
    return this.userBackgroundTopicService.findAll({ page, limit });
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserBackgroundTopicResponseDto,
    description: 'Get a user background topic by ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User background topic ID',
  })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserBackgroundTopicResponseDto> {
    return this.userBackgroundTopicService.findOne(id, { where: { id } });
  }

  @Post()
  @Roles(Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: UserBackgroundTopicResponseDto,
    description: 'Create a user background topic',
  })
  async create(
    @Body() createUserBackgroundTopicDto: CreateUserBackgroundTopicDto,
  ): Promise<UserBackgroundTopicResponseDto> {
    return this.userBackgroundTopicService.create(createUserBackgroundTopicDto);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserBackgroundTopicResponseDto,
    description: 'Update a user background topic by ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User background topic ID',
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserBackgroundTopicDto: UpdateUserBackgroundTopicDto,
  ): Promise<UserBackgroundTopicResponseDto> {
    return this.userBackgroundTopicService.update(
      id,
      updateUserBackgroundTopicDto,
    );
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete a user background topic by ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User background topic ID',
  })
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserBackgroundTopicResponseDto> {
    return this.userBackgroundTopicService.remove(id);
  }
}
