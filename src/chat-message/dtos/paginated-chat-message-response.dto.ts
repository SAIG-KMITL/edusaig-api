import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponse } from 'src/shared/pagination/dtos/paginate-response.dto';
import { ChatMessage } from '../chat-message.entity';
import { ChatMessageType } from '../enums/chat-message-type.enum';
import { UserResponseDto } from 'src/user/dtos/user-response.dto';

export class ChatMessageResponseDto {
  @ApiProperty({
    description: 'ChatMessage ID',
    type: String,
    example: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
  })
  id: string;

  @ApiProperty({
    description: 'ChatMessage content',
    type: String,
    example: 'Hello World!',
  })
  content: string;

  @ApiProperty({
    description: 'ChatMessage type',
    type: String,
    example: ChatMessageType.TEXT,
    enum: ChatMessageType,
  })
  type: ChatMessageType;

  @ApiProperty({
    description: 'ChatMessage user',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  @ApiProperty({
    description: 'ChatRoom ID',
    type: String,
    example: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
  })
  chatRoomId: string;

  @ApiProperty({
    description: 'ChatMessage reply',
    type: ChatMessageResponseDto,
    required: false,
    example: ChatMessageResponseDto,
  })
  reply?: ChatMessageResponseDto;

  constructor(chatMessage: ChatMessage) {
    this.id = chatMessage.id;
    this.content = chatMessage.content;
    this.type = chatMessage.type;
    this.user = new UserResponseDto(chatMessage.user);
    this.chatRoomId = chatMessage.chatRoom.id;
    this.reply = chatMessage.reply
      ? new ChatMessageResponseDto(chatMessage.reply)
      : null;
  }
}

export class PaginatedChatMessageResponseDto extends PaginatedResponse(
  ChatMessageResponseDto,
) {
  constructor(
    chatMessages: ChatMessage[],
    total: number,
    pageSize: number,
    currentPage: number,
  ) {
    const chatMessageDtos = chatMessages.map(
      (chatMessage) => new ChatMessageResponseDto(chatMessage),
    );
    super(chatMessageDtos, total, pageSize, currentPage);
  }
}
