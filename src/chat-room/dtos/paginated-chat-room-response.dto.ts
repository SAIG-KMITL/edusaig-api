import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponse } from 'src/shared/pagination/dtos/paginate-response.dto';
import { ChatRoom } from '../chat-room.entity';
import { ChatRoomType, ChatRoomStatus } from '../enums';
import { ChapterResponseDto } from 'src/chapter/dtos/chapter-response.dto';

export class ChatRoomResponseDto {
  @ApiProperty({
    description: 'ChatRoom ID',
    type: String,
    example: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
  })
  id: string;

  @ApiProperty({
    description: 'Chapter',
    type: String,
    example: 'Chat Room 1',
  })
  chapter: ChapterResponseDto;

  @ApiProperty({
    description: 'ChatRoom title',
    type: String,
    example: 'Chat Room 1',
  })
  title: string;

  @ApiProperty({
    description: 'ChatRoom status',
    type: String,
    example: ChatRoomStatus.ACTIVE,
    enum: ChatRoomStatus,
  })
  status: ChatRoomStatus;

  @ApiProperty({
    description: 'ChatRoom type',
    type: String,
    example: ChatRoomType.QUESTION,
    enum: ChatRoomType,
  })
  type: ChatRoomType;

  @ApiProperty({
    description: 'ChatRoom participant count',
    type: Number,
    example: 5,
  })
  paticipantCount: number;

  constructor(chatRoom: ChatRoom) {
    this.id = chatRoom.id;
    this.title = chatRoom.title;
    this.status = chatRoom.status;
    this.type = chatRoom.type;
    this.paticipantCount = chatRoom.participantCount;
    this.chapter = new ChapterResponseDto(chatRoom.chapter);
  }
}

export class PaginatedChatRoomResponseDto extends PaginatedResponse(
  ChatRoomResponseDto,
) {
  constructor(
    chatRooms: ChatRoom[],
    total: number,
    pageSize: number,
    currentPage: number,
  ) {
    const chatRoomDtos = chatRooms.map(
      (chatRoom) => new ChatRoomResponseDto(chatRoom),
    );
    super(chatRoomDtos, total, pageSize, currentPage);
  }
}
