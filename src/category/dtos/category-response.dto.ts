import { Slug } from 'src/category/enums/slug.enum';
import { Category } from '../category.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class categoryResponseDto {
  @ApiProperty({
    description: 'category id',
    type: String,
    example: '8d4887aa-28e7-4d0e-844c-28a8ccead003',
  })
  id: string;

  @ApiProperty({
    description: 'name of category',
    type: String,
    example: 'javascript',
  })
  title: string;

  @ApiPropertyOptional({
    description: 'description of category (optional)',
    type: String,
    example: 'high level programming language',
  })
  description?: string;

  @ApiProperty({
    description: 'slug',
    type: String,
    example: Slug.COURSE,
    enum: Slug,
  })
  slug: Slug;

  @ApiProperty({
    description: 'category created date',
    type: Date,
    example: new Date(),
  })
  createdAt: Date;

  @ApiProperty({
    description: 'category updated at',
    type: Date,
    example: new Date(),
  })
  updatedAt: Date;

  constructor(category: Category) {
    this.id = category.id;
    this.title = category.title;
    this.description = category.description;
    this.slug = category.slug;
    this.createdAt = category.createdAt;
    this.updatedAt = category.updatedAt;
  }
}
