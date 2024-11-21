import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  ParseUUIDPipe,
  Post,
  Patch,
  Delete,
  Query,
  UploadedFile,
  ParseFilePipeBuilder,
  StreamableFile,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { RewardService } from './reward.service';
import { Roles } from 'src/shared/decorators/role.decorator';
import {
  PaginatedRewardResponseDto,
  RewardResponseDto,
} from './dtos/reward-response.dto';
import { CreateRewardDto } from './dtos/create-reward.dto';
import { Role } from 'src/shared/enums/roles.enum';
import { UpdateRewardDto } from './dtos/update-reward.dto';
import { FileService } from 'src/file/file.service';
import { PaginateQueryDto } from 'src/shared/pagination/dtos/paginate-query.dto';
import { Folder } from 'src/file/enums/folder.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { PaginateRewardQueryDto } from './dtos/paginate-reward-query.dto';
import { Type } from './enums/type.enum';

@Controller('reward')
@Injectable()
@ApiTags('Reward')
@ApiBearerAuth()
export class RewardController {
  constructor(
    private readonly rewardService: RewardService,
    private readonly fileService: FileService,
  ) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: PaginatedRewardResponseDto,
    description: 'get all reward',
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
    description: 'Search by name',
  })
  @ApiQuery({
    name: 'type',
    type: String,
    required: false,
    description: `search by ${Type.BADGE} ${Type.CERTIFICATE} or ${Type.ITEM}`,
  })
  async findAll(
    @Req() request: AuthenticatedRequest,
    @Query() query: PaginateRewardQueryDto,
  ): Promise<PaginatedRewardResponseDto> {
    return this.rewardService.findAll(query, request.user.role);
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: RewardResponseDto,
    description: 'get reward',
  })
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<RewardResponseDto> {
    const reward = await this.rewardService.findOne(id, request.user.role);
    return new RewardResponseDto(reward);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    type: RewardResponseDto,
    description: 'create new reward',
  })
  async create(
    @Body() CreateRewardDto: CreateRewardDto,
  ): Promise<RewardResponseDto> {
    return this.rewardService.create(CreateRewardDto);
  }

  @Get('thumbnail/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get thumbnail reward',
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
    @Req() request: AuthenticatedRequest,
  ): Promise<StreamableFile> {
    const reward = await this.rewardService.findOne(id, request.user.role);
    const file = await this.fileService.get(Folder.REWARD_THUMBNAILS, id);
    return new StreamableFile(file, {
      disposition: 'inline',
      type: `image/${reward.thumbnail.split('.').pop()}`,
    });
  }

  @Patch('thumbnail/:id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({
    description: 'upload file thumbnail of reward successfully',
    status: HttpStatus.NO_CONTENT,
  })
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
  async uploadThumbnail(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image/*' })
        .build({
          fileIsRequired: true,
          errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        }),
    )
    file: Express.Multer.File,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
    @Req() request: AuthenticatedRequest,
  ): Promise<void> {
    const reward = await this.rewardService.findOne(id, request.user.role);
    if (reward.thumbnail)
      await this.fileService.update(Folder.REWARD_THUMBNAILS, id, file);
    else {
      await this.fileService.upload(Folder.REWARD_THUMBNAILS, id, file);
      await this.rewardService.update(id, {
        thumbnail: `${id}.${file.mimetype.split('/').pop()}`,
      });
    }
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
    type: RewardResponseDto,
    description: 'edit reward',
  })
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
    @Body() UpdateRewardDto: UpdateRewardDto,
  ): Promise<RewardResponseDto> {
    const reward = await this.rewardService.update(id, UpdateRewardDto);
    return new RewardResponseDto(reward);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'delete reward',
  })
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
    await this.rewardService.delete(id);
  }
}
