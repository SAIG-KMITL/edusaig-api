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
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { categoryResponseDto } from './dtos/category-response.dto';
import { CreateCategoryDto } from './dtos/create-cateory.dto';
import { updateCategoryDto } from './dtos/update-category.dto';
import { Public } from 'src/shared/decorators/public.decorator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Category } from './category.entity';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/enums';

@Controller('category')
@Injectable()
@ApiTags('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiResponse({
    status: HttpStatus.OK,
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
  async findAll(): Promise<categoryResponseDto[]> {
    const categories = await this.categoryService.findAll();
    return categories.map((category) => new categoryResponseDto(category));
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
