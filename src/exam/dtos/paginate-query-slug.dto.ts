import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Slug } from 'src/category/enums/slug.enum';
import { PaginateQueryDto } from 'src/shared/pagination/dtos/paginate-query.dto';

class SlugQueryDto {
  @ApiProperty({
    name: 'slug',
    enum: Slug,
    required: false,
    description: `sort by slug (${Slug.COURSE} or ${Slug.REWARD})`,
  })
  @IsOptional()
  @IsEnum(Slug, { message: `slug must be ${Slug.COURSE} or ${Slug.REWARD}` })
  slug: Slug;
}

export class PaginateCategoryQueryDto extends IntersectionType(
  PaginateQueryDto,
  SlugQueryDto,
) {}
