import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createPagination } from 'src/shared/pagination';
import { FindOneOptions, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { Chapter } from './chapter.entity';
import { PaginatedChapterResponseDto } from './dtos/chapter-response.dto';
import { CreateChapterDto } from './dtos/create-chapter.dto';
import { UpdateChapterDto } from './dtos/update-chapter.dto';
import { ChatRoomService } from 'src/chat-room/chat-room.service';
import { ChatRoomStatus, ChatRoomType } from 'src/chat-room/enums';

@Injectable()
export class ChapterService {
    constructor(
        @InjectRepository(Chapter)
        private readonly chapterRepository: Repository<Chapter>,
        private readonly chatRoomService: ChatRoomService,
    ) { }

    async findAll({
        page = 1,
        limit = 20,
        search = '',
    }: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<PaginatedChapterResponseDto> {
        const { find } = await createPagination(this.chapterRepository, {
            page,
            limit,
        });

        const baseSearch = search ? { title: ILike(`%${search}%`) } : {};
        const whereCondition = { ...baseSearch };

        const chapters = await find({
            where: whereCondition,
            relations: {
                module: true,
            },
        }).run();

        return chapters;
    }

    async findOne(
        id: string,
        options: FindOneOptions<Chapter>,
    ): Promise<Chapter> {
        const baseWhere = options.where as FindOptionsWhere<Chapter>;
        const whereCondition = { ...baseWhere, id };

        const chapter = await this.chapterRepository.findOne({
            where: whereCondition,
            relations: {
                module: true,
            },
        });

        if (!chapter) {
            throw new NotFoundException('Chapter not found');
        }

        return chapter;
    }

    async validateAndGetNextOrderIndex(moduleId: string): Promise<number> {
        const existingChapter = await this.chapterRepository.find({
            where: { moduleId },
            order: { orderIndex: 'DESC' },
        });

        const nextOrderIndex = existingChapter.map((chapter) => chapter.orderIndex);
        const hasDuplicates =
            new Set(nextOrderIndex).size !== nextOrderIndex.length;

        if (hasDuplicates) {
            throw new BadRequestException('Order index is duplicated');
        }

        return nextOrderIndex.length ? nextOrderIndex[0] + 1 : 1;
    }

    async create(createChapterDto: CreateChapterDto): Promise<Chapter> {
        if (!createChapterDto.orderIndex) {
            createChapterDto.orderIndex = await this.validateAndGetNextOrderIndex(
                createChapterDto.moduleId,
            );
        } else {
            const existingChapter = await this.chapterRepository.findOne({
                where: { orderIndex: createChapterDto.orderIndex },
            });

            if (existingChapter) {
                throw new BadRequestException('Order index is duplicated');
            }
        }

        const chapter = this.chapterRepository.create(createChapterDto);

        await this.chapterRepository.save(chapter);
        await this.chatRoomService.create({
            name: `${chapter.title} Questions`,
            type: ChatRoomType.QUESTION,
            chapterId: chapter.id,
            status: ChatRoomStatus.ACTIVE,
        });
        await this.chatRoomService.create({
            name: `${chapter.title} Discussion`,
            type: ChatRoomType.DISCUSSION,
            chapterId: chapter.id,
            status: ChatRoomStatus.ACTIVE,
        });
        return chapter;
    }

    async reorderModules(moduleId: string): Promise<void> {
        const modulesToReorder = await this.chapterRepository.find({
            where: { moduleId },
            order: { orderIndex: 'ASC' },
        });

        for (let i = 0; i < modulesToReorder.length; i++) {
            modulesToReorder[i].orderIndex = i + 1;
        }

        await this.chapterRepository.save(modulesToReorder);
    }

    async update(
        id: string,
        updateChapterDto: UpdateChapterDto,
    ): Promise<Chapter> {
        const chapter = await this.findOne(id, { where: { id } });

        if (!chapter) {
            throw new NotFoundException('Chapter not found');
        }

        if (
            updateChapterDto.orderIndex &&
            updateChapterDto.orderIndex !== chapter.orderIndex
        ) {
            const existingChapter = await this.chapterRepository.findOne({
                where: { orderIndex: updateChapterDto.orderIndex },
            });

            if (existingChapter) {
                throw new BadRequestException('Order index is duplicated');
            }
        }

        this.chapterRepository.merge(chapter, updateChapterDto);
        await this.chapterRepository.save(chapter);

        return chapter;
    }

    async remove(id: string): Promise<Chapter> {
        const chapter = await this.findOne(id, { where: { id } });

        if (!chapter) {
            throw new BadRequestException('Chapter not found');
        }

        const result = await this.chapterRepository.remove(chapter);

        await this.reorderModules(chapter.moduleId);

        return result;
    }
}
