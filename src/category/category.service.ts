import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-cateory.dto';
import { Category } from './category.entity';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { updateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('CategoryRepository')
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
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
