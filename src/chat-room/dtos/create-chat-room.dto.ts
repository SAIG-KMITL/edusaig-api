import { IsString, IsEnum, IsUUID, IsNotEmpty } from 'class-validator';
import { ChatRoomType, ChatRoomStatus } from '../enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatRoomDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ChatRoom title',
    type: String,
    example: 'Chat Room 1',
  })
  title: string;

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

  @IsUUID('4')
  @IsNotEmpty()
  @ApiProperty({
    description: 'Chapter ID',
    type: String,
    example: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
  })
  chapterId: string;
}
