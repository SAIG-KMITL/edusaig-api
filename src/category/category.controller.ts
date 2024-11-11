import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { categoryResponseDto } from './dtos/category-response.dto';
import { Get } from '@nestjs/common';
import { CreateCategoryDto } from './dtos/create-cateory.dto';
import { updateCategoryDto } from './dtos/update-category.dto';
import { Public } from 'src/shared/decorators/public.decorator';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(
    @Body() CreateCategoryDto: CreateCategoryDto,
  ): Promise<categoryResponseDto> {
    return this.categoryService.create(CreateCategoryDto);
  }

  @Get()
  @Public()
  async findAll(): Promise<categoryResponseDto[]> {
    const categories = await this.categoryService.findAll();
    return categories.map((category) => new categoryResponseDto(category));
  }

  @Get(':id')
  async findOne(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ): Promise<categoryResponseDto> {
    const category = await this.categoryService.findOne({ where: { id } });
    return new categoryResponseDto(category);
  }

  @Patch(':id')
  async update(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
    @Body() updateCategoryDto: updateCategoryDto,
  ): Promise<categoryResponseDto> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  async delete(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    id: string,
  ): Promise<void> {
    return this.categoryService.delete({ id });
  }
}
