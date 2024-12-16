import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-cateory.dto';
import { Category } from './category.entity';
import { FindOneOptions, FindOptionsWhere, ILike, Repository } from 'typeorm';
import { updateCategoryDto } from './dtos/update-category.dto';
import { Slug } from './enums/slug.enum';
import { createPagination } from 'src/shared/pagination';
import { PaginatedCategoryDto } from './dtos/category-response.dto';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll({
    page = 1,
    limit = 20,
    search = '',
    slug = '',
  }: {
    page?: number;
    limit?: number;
    search?: string;
    slug?: Slug | '';
  }): Promise<PaginatedCategoryDto> {
    const { find } = await createPagination(this.categoryRepository, {
      page,
      limit,
    });
    const conditionSearch = search ? { title: ILike(`%${search}%`) } : {};
    const connditionSlug = slug ? { slug: slug } : {};
    const categories = await find({
      where: {
        ...conditionSearch,
        ...connditionSlug,
      },
    }).run();
    return categories;
  }

  async findOne(options: FindOneOptions<Category>): Promise<Category> {
    const category = await this.categoryRepository.findOne(options);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(CreateCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const category = await this.categoryRepository.save(CreateCategoryDto);
      return category;
    } catch (error) {
      if (error instanceof Error)
        throw new BadRequestException('category already exists');
    }
  }

  async update(
    id: string,
    updateCategoryDto: updateCategoryDto,
  ): Promise<Category> {
    try {
      await this.categoryRepository.update(id, updateCategoryDto);
      return this.categoryRepository.findOne({ where: { id } });
    } catch (error) {
      if (error instanceof Error) {
        throw new NotFoundException('category not found');
      }
    }
  }

  async delete(options: FindOptionsWhere<Category>): Promise<void> {
    try {
      await this.categoryRepository.delete(options);
    } catch (error) {
      if (error instanceof Error)
        throw new NotFoundException('category not found');
    }
  }
}
