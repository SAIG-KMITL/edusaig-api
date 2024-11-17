import { DataSource } from 'typeorm';
import { Category } from './category.entity';

export const categoryProviders = [
  {
    provide: 'CategoryRepository',
    useFactory: (DataSource: DataSource) => DataSource.getRepository(Category),
    inject: ['DataSource'],
  },
];
