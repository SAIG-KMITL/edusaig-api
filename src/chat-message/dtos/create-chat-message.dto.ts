import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { ChatMessageType } from '../enums/chat-message-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatMessageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ChatMessage content',
    type: String,
    example: 'Hello World!',
  })
  content: string;

  @IsOptional()
  @IsUUID('4')
  @ApiProperty({
    description: 'ChatMessage reply ID',
    type: String,
    example: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
    required: false,
  })
  replyId?: string;

  @IsEnum(ChatMessageType)
  @IsNotEmpty()
  @ApiProperty({
    description: 'ChatMessage type',
    type: String,
    example: ChatMessageType.TEXT,
    enum: ChatMessageType,
  })
  type: ChatMessageType;

  @IsNotEmpty()
  @IsUUID('4')
  @ApiProperty({
    description: 'ChatRoom ID',
    type: String,
    example: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
  })
  chatRoomId: string;
}
