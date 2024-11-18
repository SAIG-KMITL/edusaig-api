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
import { CourseStatus, Role } from 'src/shared/enums';
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
        userId,
        role,
    }: {
        page?: number;
        limit?: number;
        search?: string;
        userId: string;
        role: Role;
    }): Promise<PaginatedChapterResponseDto> {
        const { find } = await createPagination(this.chapterRepository, {
            page,
            limit,
        });

        const baseSearch = search ? { title: ILike(`%${search}%`) } : {};
        const whereCondition = this.buildWhereCondition(userId, role, baseSearch);

        const chapters = await find({
            where: whereCondition,
            relations: {
                module: true,
            },
        }).run();

        return chapters;
    }

    async findOne(
        userId: string,
        role: Role,
        options: FindOneOptions<Chapter>,
    ): Promise<Chapter> {
        const baseWhere = options.where as FindOptionsWhere<Chapter>;
        const whereCondition = this.buildWhereCondition(userId, role, baseWhere);

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

        let orderIndex = await this.validateAndGetNextOrderIndex(
            createChapterDto.moduleId,
        );


        const createdChapter = this.chapterRepository.create({ ...createChapterDto, orderIndex: orderIndex });
        const savedChapter = await this.chapterRepository.save(createdChapter);
        await this.chatRoomService.create({
            title: `${savedChapter.title} Questions`,
            type: ChatRoomType.QUESTION,
            chapterId: savedChapter.id,
            status: ChatRoomStatus.ACTIVE,
        });
        await this.chatRoomService.create({
            title: `${savedChapter.title} Discussion`,
            type: ChatRoomType.DISCUSSION,
            chapterId: savedChapter.id,
            status: ChatRoomStatus.ACTIVE,
        });
        return savedChapter;
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
        const chapter = await this.chapterRepository.findOne({ where: { id } });

        if (!chapter) {
            throw new NotFoundException('Chapter not found');
        }
        if (updateChapterDto.orderIndex != null) {
            await this.validateOrderIndex(chapter.moduleId, updateChapterDto.orderIndex);
        }
        if (
            updateChapterDto.orderIndex &&
            updateChapterDto.orderIndex !== chapter.orderIndex
        ) {
            const existingChapter = await this.chapterRepository.findOne({
                where: {
                    moduleId: chapter.moduleId,
                    orderIndex: updateChapterDto.orderIndex
                },
            });

            if (existingChapter) {
                await this.chapterRepository.update(existingChapter.id, { orderIndex: chapter.orderIndex });
            }
        }

        Object.assign(chapter, updateChapterDto);
        await this.chapterRepository.save(chapter);

        return chapter;
    }

    async remove(id: string): Promise<Chapter> {
        const chapter = await this.chapterRepository.findOne({ where: { id } });

        if (!chapter) {
            throw new BadRequestException('Chapter not found');
        }

        const result = await this.chapterRepository.remove(chapter);

        await this.reorderModules(chapter.moduleId);

        return result;
    }

    private async validateOrderIndex(moduleId: string, orderIndex: number): Promise<void> {
        const existingModules = await this.chapterRepository.find({
            where: { moduleId },
            order: { orderIndex: 'ASC' },
        });
        if (existingModules.length === 0) {
            if (orderIndex !== 1) {
                throw new BadRequestException(
                    'Order index should be 1 when there are no modules in the course'
                );
            }
            return;
        }
        const minIndex = 1;
        const maxIndex = existingModules[existingModules.length - 1].orderIndex;

        if (orderIndex < minIndex || orderIndex > maxIndex) {
            throw new BadRequestException(
                `Order index must be between ${minIndex} and ${maxIndex}`
            );
        }
    }
    async validateOwnership(id: string, userId: string): Promise<void> {
        const chapter = await this.chapterRepository.findOne({ where: { id }, relations: { module: { course: { teacher: true } } } });
        if (!chapter) throw new NotFoundException('Chapter not found');
        if (chapter.module.course.teacher.id !== userId)
            throw new BadRequestException('You can only access your own courses');
    }
    private buildWhereCondition(
        userId: string,
        role: Role,
        baseCondition: FindOptionsWhere<Chapter> = {}
    ) {
        const conditions: Record<
            Role,
            () => FindOptionsWhere<Chapter> | FindOptionsWhere<Chapter>[]
        > = {
            [Role.STUDENT]: () => ({
                ...baseCondition,
                module: {
                    course: {
                        status: CourseStatus.PUBLISHED,
                    },
                },
            }),
            [Role.TEACHER]: () => [
                {
                    ...baseCondition,
                    module: {
                        course: {
                            status: CourseStatus.PUBLISHED,
                        },
                    },
                },
                {
                    ...baseCondition,
                    module: {
                        course: {
                            teacher: {
                                id: userId,
                            },
                        },
                    },
                },
            ],
            [Role.ADMIN]: () => baseCondition,
        };

        const buildCondition = conditions[role];

        if (!buildCondition) {
            throw new BadRequestException('Invalid role');
        }

        return buildCondition();
    }

}
