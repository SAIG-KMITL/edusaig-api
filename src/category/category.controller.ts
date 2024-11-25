import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Injectable,
  Get,
  Query,
  HttpCode,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  categoryResponseDto,
  PaginatedCategoryDto,
} from './dtos/category-response.dto';
import { CreateCategoryDto } from './dtos/create-cateory.dto';
import { updateCategoryDto } from './dtos/update-category.dto';
import { Public } from 'src/shared/decorators/public.decorator';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { Category } from './category.entity';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/enums';
import { PaginateQueryDto } from 'src/shared/pagination/dtos/paginate-query.dto';
import { Slug } from './enums/slug.enum';
import { PaginateCategoryQueryDto } from 'src/category/dtos/paginate-query-slug.dto';

@Controller('category')
@Injectable()
@ApiTags('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: categoryResponseDto,
    description: 'create category',
  })
  @ApiBearerAuth()
  async create(
    @Body() CreateCategoryDto: CreateCategoryDto,
  ): Promise<categoryResponseDto> {
    return this.categoryService.create(CreateCategoryDto);
  }

  @Get()
  @Public()
  @ApiResponse({
    status: HttpStatus.OK,
    type: categoryResponseDto,
    isArray: true,
    description: 'get all categories',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    description: 'Search by title',
  })
  @ApiQuery({
    name: 'slug',
    type: String,
    required: false,
    description: `search by slug (${Slug.COURSE} or ${Slug.REWARD})`,
  })
  async findAll(
    @Query() query: PaginateCategoryQueryDto,
  ): Promise<PaginatedCategoryDto> {
    return await this.categoryService.findAll({
      page: query.page,
      limit: query.limit,
      search: query.search,
      slug: query.slug,
    });
  }

  @Get(':id')
  @Public()
  @ApiResponse({
    status: HttpStatus.OK,
    type: categoryResponseDto,
    description: 'get one category',
  })
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
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'edit category',
    type: categoryResponseDto,
  })
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
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'delete category',
  })
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
