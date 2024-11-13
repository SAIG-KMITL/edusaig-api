import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { Public } from 'src/shared/decorators/public.decorator';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/enums/roles.enum';
import { PaginateQueryDto } from 'src/shared/pagination/dtos/paginate-query.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import {
  PaginatedUserResponseDto,
  UserResponseDto,
} from './dtos/user-response.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
@Injectable()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDto,
    description: 'Get user profile',
  })
  async getProfile(
    @Req() request: AuthenticatedRequest,
  ): Promise<UserResponseDto> {
    const user = await this.userService.findOne({
      where: { id: request.user.id },
    });
    return new UserResponseDto(user);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    type: PaginatedUserResponseDto,
    description: 'Get all users',
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
  async findAll(
    @Query() query: PaginateQueryDto,
  ): Promise<PaginatedUserResponseDto> {
    return this.userService.findAll({
      page: query.page,
      limit: query.limit,
      search: query.search,
    });
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDto,
    description: 'Get user by id',
  })
  @Public()
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ): Promise<UserResponseDto> {
    const user = await this.userService.findOne({ where: { id } });
    return new UserResponseDto(user);
  }

  @Patch()
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDto,
    description: 'Update user',
  })
  async update(
    @Req() request: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.update(request.user.id, updateUserDto);
    return new UserResponseDto(user);
  }

  @Delete()
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Delete user',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Req() request: AuthenticatedRequest,
  ): Promise<{ massage: string }> {
    await this.userService.delete(request.user.id);
    return { massage: 'User deleted successfully' };
  }
}
