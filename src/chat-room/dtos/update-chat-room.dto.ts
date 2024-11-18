import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { ChatRoomType, ChatRoomStatus } from '../enums';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateChatRoomDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ChatRoom name',
    type: String,
    example: 'Chat Room 1',
  })
  name: string;

  @IsEnum(ChatRoomType)
  @ApiProperty({
    description: 'ChatRoom type',
    type: String,
    example: ChatRoomType.QUESTION,
    enum: ChatRoomType,
  })
  type: ChatRoomType;

  @IsEnum(ChatRoomStatus)
  @ApiProperty({
    description: 'ChatRoom status',
    type: String,
    example: ChatRoomStatus.ACTIVE,
    enum: ChatRoomStatus,
  })
  status: ChatRoomStatus;
}
