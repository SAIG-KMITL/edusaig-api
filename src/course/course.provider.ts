import { DataSource } from 'typeorm';
import { Course } from './course.entity';

export const courseProviders = [
  {
    provide: 'CourseRepository',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Course),
    inject: ['DataSource'],
  },
];
