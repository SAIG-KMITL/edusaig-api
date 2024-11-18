import {
  Controller,
  Injectable,
  Query,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  HttpCode,
  Body,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Get } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { PaginateQueryDto } from 'src/shared/pagination/dtos/paginate-query.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import {
  ChatRoomResponseDto,
  PaginatedChatRoomResponseDto,
} from './dtos/paginated-chat-room-response.dto';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/enums';
import { CreateChatRoomDto } from './dtos/create-chat-room.dto';
import { UpdateChatRoomDto } from './dtos/update-chat-room.dto';
import { ChatRoomOwnershipGuard } from './guards/chat-room-ownership.guard';

@Controller('chat-room')
@Injectable()
@ApiTags('Chat Room')
@ApiBearerAuth()
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all chat rooms',
    type: PaginatedChatRoomResponseDto,
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
  })
  @Roles(Role.ADMIN)
  async findAll(@Query() query: PaginateQueryDto) {
    return await this.chatRoomService.findAll(query);
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get chat room by id',
    type: ChatRoomResponseDto,
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @Roles(Role.ADMIN, Role.STUDENT)
  @UseGuards(ChatRoomOwnershipGuard)
  async findById(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ) {
    return new ChatRoomResponseDto(
      await this.chatRoomService.findOne({ where: { id } }),
    );
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create chat room',
    type: ChatRoomResponseDto,
  })
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createChatRoomDto: CreateChatRoomDto) {
    return new ChatRoomResponseDto(
      await this.chatRoomService.create(createChatRoomDto),
    );
  }

  @Patch(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update chat room',
    type: ChatRoomResponseDto,
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @Roles(Role.ADMIN)
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
    @Body() updateChatRoomDto: UpdateChatRoomDto,
  ) {
    return new ChatRoomResponseDto(
      await this.chatRoomService.update({ id }, updateChatRoomDto),
    );
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Delete chat room',
    type: ChatRoomResponseDto,
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ) {
    return await this.chatRoomService.delete({ id });
  }
}
