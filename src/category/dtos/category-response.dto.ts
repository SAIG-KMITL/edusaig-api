import { Slug } from 'src/shared/enums/slug.enum';
import { Category } from '../category.entity';

export class categoryResponseDto {
  id: string;
  title: string;
  description: string;
  slug: Slug;
  createdAt: Date;
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
