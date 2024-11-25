import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/enums';
import { CreateChatMessageDto, ChatMessageResponseDto } from './dtos';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { CreateChatMessageGuard } from './guards/create-chat-message.guard';
import { HttpService } from '@nestjs/axios';
import { catchError } from 'rxjs';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { GLOBAL_CONFIG } from 'src/shared/constants/global-config.constant';
import { QADto } from './dtos/qa.dto';

@Controller('chat-message')
@Injectable()
@ApiTags('Chat Message')
@ApiBearerAuth()
export class ChatMessageController {
  constructor(
    private readonly chatMessageService: ChatMessageService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

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
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(CreateChatMessageGuard)
  @Roles(Role.STUDENT, Role.ADMIN)
  async create(
    @Body() createChatMessageDto: CreateChatMessageDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const chatMessages = await this.chatMessageService.findMany({
      chatRoom: { id: createChatMessageDto.chatRoomId },
    });
    const chatMessage = await this.chatMessageService.create(
      request.user.id,
      createChatMessageDto,
    );
    const response = this.httpService
      .post<string>(
        `${this.configService.getOrThrow<string>(GLOBAL_CONFIG.AI_URL)}/qa`,
        new QADto('chapterSummary', chatMessages),
      )
      .pipe(
        catchError((error: AxiosError) => {
          throw new InternalServerErrorException(error.message);
        }),
      );
    console.log(response);
    return new ChatMessageResponseDto(chatMessage);
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
    const chatMessage = await this.chatMessageService.update(
      { id },
      updateChatMessageDto,
    );
    return new ChatMessageResponseDto(chatMessage);
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
