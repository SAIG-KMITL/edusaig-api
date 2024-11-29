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
import { CreateUserOccupationDto } from './dtos/create-user-occupation.dto';
import { UpdateUserOccupationDto } from './dtos/update-user-occupation.dto';
import {
  PaginatedUserOccupationResponseDto,
  UserOccupationResponseDto,
} from './dtos/user-occupation-response.dto';
import { UserOccupationService } from './user-occupation.service';
import { Public } from 'src/shared/decorators/public.decorator';

@Controller('user-occupation')
@ApiTags('User Occupation')
@ApiBearerAuth()
@Injectable()
export class UserOccupationController {
  constructor(private readonly userOccupationService: UserOccupationService) {}

  @Post()
  @Roles(Role.ADMIN)
  @Public()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: UserOccupationResponseDto,
    description: 'Create user occupation',
  })
  async create(
    @Body() createUserOccupationDto: CreateUserOccupationDto,
  ): Promise<UserOccupationResponseDto> {
    const userOccupation = await this.userOccupationService.create(
      createUserOccupationDto,
    );

    return new UserOccupationResponseDto(userOccupation);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: PaginatedUserOccupationResponseDto,
    description: 'Get all user occupations',
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
  ): Promise<PaginatedUserOccupationResponseDto> {
    return this.userOccupationService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserOccupationResponseDto,
    description: 'Get user occupation by ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User occupation ID',
  })
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserOccupationResponseDto> {
    const userOccupation = await this.userOccupationService.findOne(id, {
      where: { id },
    });

    return new UserOccupationResponseDto(userOccupation);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserOccupationResponseDto,
    description: 'Update user occupation by ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User occupation ID',
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserOccupationDto: UpdateUserOccupationDto,
  ): Promise<UserOccupationResponseDto> {
    const userOccupation = await this.userOccupationService.update(
      id,
      updateUserOccupationDto,
    );

    return new UserOccupationResponseDto(userOccupation);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserOccupationResponseDto,
    description: 'Delete user occupation by ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User occupation ID',
  })
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserOccupationResponseDto> {
    const userOccupation = await this.userOccupationService.remove(id);

    return new UserOccupationResponseDto(userOccupation);
  }
}
