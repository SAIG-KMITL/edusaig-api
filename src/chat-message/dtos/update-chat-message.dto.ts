import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsEnum,
} from 'class-validator';
import { ChatMessageType } from '../enums/chat-message-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateChatMessageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ChatMessage content',
    type: String,
    example: 'Hello World!',
  })
  content: string;

  @IsEnum(ChatMessageType)
  @IsNotEmpty()
  @ApiProperty({
    description: 'ChatMessage type',
    type: String,
    example: ChatMessageType.TEXT,
    enum: ChatMessageType,
  })
  type: ChatMessageType;
}
