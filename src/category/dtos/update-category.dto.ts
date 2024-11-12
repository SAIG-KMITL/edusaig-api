import { IsOptional, IsString, IsEnum } from '@nestjs/class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Slug } from 'src/category/enums/slug.enum';

export class updateCategoryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'name of category',
    type: String,
    example: 'javascript',
  })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'description of category (optional)',
    type: String,
    example: 'high level programming language',
  })
  description?: string;

  @IsEnum(Slug, {
    message: `Invalid role. Role should be either ${Slug.COURSE} or ${Slug.REWARD}`,
  })
  @IsOptional()
  @ApiProperty({
    description: 'slug',
    type: String,
    example: Slug.COURSE,
    enum: Slug,
  })
  slug: Slug;
}
