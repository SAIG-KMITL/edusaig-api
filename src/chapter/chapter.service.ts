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

@Injectable()
export class ChapterService {
  constructor(
    @InjectRepository(Chapter)
    private readonly chapterRepository: Repository<Chapter>,
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

    let orderIndex = await this.validateAndGetNextOrderIndex(
      createChapterDto.moduleId,
    );


    const chapter = this.chapterRepository.create({...createChapterDto, orderIndex: orderIndex});

    await this.chapterRepository.save(chapter);
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
    if (updateChapterDto.orderIndex != null) {
      await this.validateOrderIndex(chapter.moduleId, updateChapterDto.orderIndex); 
    }
    if (
      updateChapterDto.orderIndex &&
      updateChapterDto.orderIndex !== chapter.orderIndex
    ) {
      const existingChapter = await this.chapterRepository.findOne({
        where: { orderIndex: updateChapterDto.orderIndex },
      });

      if (existingChapter) {
        await this.chapterRepository.update(existingChapter.id, { orderIndex: chapter.orderIndex });
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
}
