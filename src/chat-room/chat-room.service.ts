import {
  Injectable,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { ChatRoom } from './chat-room.entity';
import { createPagination } from 'src/shared/pagination';
import {
  UpdateChatRoomDto,
  PaginatedChatRoomResponseDto,
  CreateChatRoomDto,
} from './dtos';

@Injectable()
export class ChatRoomService {
  constructor(
    @Inject('ChatRoomRepository')
    private readonly chatRoomRepository: Repository<ChatRoom>,
  ) {}

  async create(createChatRoomDto: CreateChatRoomDto): Promise<ChatRoom> {
    try {
      return await this.chatRoomRepository.save({
        ...createChatRoomDto,
        chapter: { id: createChatRoomDto.chapterId },
      });
    } catch (error) {
      if (error instanceof Error)
        throw new InternalServerErrorException(error.message);
    }
  }

  async findAll({
    page = 1,
    limit = 20,
    search = '',
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedChatRoomResponseDto> {
    const { find } = await createPagination(this.chatRoomRepository, {
      page,
      limit,
    });
    const chatRooms = await find({
      where: { chapter: { id: search } },
    }).run();
    return new PaginatedChatRoomResponseDto(
      chatRooms.data,
      chatRooms.meta.total,
      chatRooms.meta.pageSize,
      chatRooms.meta.currentPage,
    );
  }

  async findOne(options: FindOneOptions<ChatRoom>): Promise<ChatRoom> {
    try {
      return await this.chatRoomRepository.findOne(options);
    } catch (error) {
      if (error instanceof Error) throw new NotFoundException(error.message);
    }
  }

  async update(
    criteria: FindOptionsWhere<ChatRoom>,
    updateChatRoomDto: UpdateChatRoomDto,
  ): Promise<ChatRoom> {
    try {
      await this.chatRoomRepository.update(criteria, updateChatRoomDto);
      return await this.findOne({ where: criteria });
    } catch (error) {
      if (error instanceof Error) throw new NotFoundException(error.message);
    }
  }

  async delete(criteria: FindOptionsWhere<ChatRoom>): Promise<void> {
    try {
      await this.chatRoomRepository.delete(criteria);
    } catch (error) {
      if (error instanceof Error) throw new NotFoundException(error.message);
    }
  }
}
