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
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PaginateQueryDto } from 'src/shared/pagination/dtos/paginate-query.dto';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/enums';
import { CreateChatMessageDto, ChatMessageResponseDto } from './dtos';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';

@Controller('chat-message')
@Injectable()
@ApiTags('Chat Message')
@ApiBearerAuth()
export class ChatMessageController {
  constructor(private readonly chatMessageService: ChatMessageService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all chat messages',
    type: ChatMessageResponseDto,
    isArray: true,
  })
  @Roles(Role.ADMIN)
  async findAll(
    @Query() query: PaginateQueryDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return await this.chatMessageService.findAll({
      userId: request.user.id,
      ...query,
    });
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a chat message by id',
    type: ChatMessageResponseDto,
  })
  @Roles(Role.ADMIN)
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ) {
    return await this.chatMessageService.findOne({ where: { id } });
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Creates a chat message',
    type: ChatMessageResponseDto,
  })
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createChatMessageDto: CreateChatMessageDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return await this.chatMessageService.create(
      request.user.id,
      createChatMessageDto,
    );
  }

  @Patch(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updates a chat message by id',
    type: ChatMessageResponseDto,
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
    @Body() updateChatMessageDto: CreateChatMessageDto,
  ) {
    return await this.chatMessageService.update({ id }, updateChatMessageDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Deletes a chat message by id',
  })
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
    await this.chatMessageService.delete({ id });
  }
}
