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
  StreamableFile,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
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
import { FileService } from 'src/file/file.service';
import { Folder } from 'src/file/enums/folder.enum';
import { hash } from 'argon2';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
@ApiTags('User')
@Injectable()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}

  @Get(':id/avatar')
  @Public()
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User id',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get user avatar',
    type: StreamableFile,
  })
  async getAvatar(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ): Promise<StreamableFile> {
    const user = await this.userService.findOne({ where: { id } });
    const file = await this.fileService.get(Folder.PROFILES, user.profileKey);
    return new StreamableFile(file, {
      disposition: 'inline',
      type: `image/${user.profileKey.split('.').pop()}`,
    });
  }

  @Patch('avatar')
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User avatar updated successfully',
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
  async uploadProfileAvatar(
    @Req() request: AuthenticatedRequest,
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
    const user = await this.userService.findOne({
      where: { id: request.user.id },
    });
    if (user.profileKey)
      await this.fileService.update(Folder.PROFILES, user.profileKey, file);
    else {
      await this.fileService.upload(Folder.PROFILES, user.id, file);
    }
    await this.userService.update(request.user.id, { profileKey: `${user.id}.${file.originalname.split('.').pop()}` });
  }

  @Get('avatar')
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get user avatar',
    type: StreamableFile,
  })
  async getProfileAvatar(
    @Req() request: AuthenticatedRequest,
  ): Promise<StreamableFile> {
    const user = await this.userService.findOne({
      where: { id: request.user.id },
    });
    const file = await this.fileService.get(Folder.PROFILES, user.profileKey);
    return new StreamableFile(file, {
      disposition: 'inline',
      type: `image/${user.profileKey.split('.').pop()}`,
    });
  }

  @Get('profile')
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserResponseDto,
    description: 'Update user',
  })
  async update(
    @Req() request: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    if (updateUserDto.password)
      updateUserDto.password = await hash(updateUserDto.password);
    const user = await this.userService.update(request.user.id, updateUserDto);
    return new UserResponseDto(user);
  }

  @Delete()
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Delete user',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Req() request: AuthenticatedRequest,
  ): Promise<void> {
    await this.userService.delete({ id: request.user.id });
  }
}
