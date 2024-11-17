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
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/enums';
import { PaginateQueryDto } from 'src/shared/pagination/dtos/paginate-query.dto';
import { CreateUserBackground } from './dtos/create-user-background.dto';
import { UpdateUserBackground } from './dtos/update-user-background.dto';
import {
  PaginatedUserBackgroundResponseDto,
  UserBackgroundResponseDto,
} from './dtos/user-background-response.dto';
import { UserBackgroundService } from './user-background.service';

@Controller('user-background')
@ApiTags('User Background')
@ApiBearerAuth()
@Injectable()
export class UserBackgroundController {
  constructor(private readonly userBackgroundService: UserBackgroundService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserBackgroundResponseDto,
    description: 'Get all user backgrounds',
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
  @Roles(Role.ADMIN)
  async findAll(
    @Query() query: PaginateQueryDto,
  ): Promise<PaginatedUserBackgroundResponseDto> {
    return this.userBackgroundService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserBackgroundResponseDto,
    description: 'Get user background by ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User background ID',
  })
  @Roles(Role.ADMIN)
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserBackgroundResponseDto> {
    return this.userBackgroundService.findOne(id, { where: { id } });
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: UserBackgroundResponseDto,
    description: 'Create a user background',
  })
  @Roles(Role.ADMIN)
  async create(
    @Body() data: CreateUserBackground,
  ): Promise<UserBackgroundResponseDto> {
    return this.userBackgroundService.create(data);
  }

  @Patch(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserBackgroundResponseDto,
    description: 'Update user background by ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User background ID',
  })
  @Roles(Role.ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateUserBackground,
  ): Promise<UserBackgroundResponseDto> {
    return this.userBackgroundService.update(id, data);
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserBackgroundResponseDto,
    description: 'Delete user background by ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User background ID',
  })
  @Roles(Role.ADMIN)
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserBackgroundResponseDto> {
    return this.userBackgroundService.remove(id);
  }
}
