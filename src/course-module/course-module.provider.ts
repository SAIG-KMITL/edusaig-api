import { DataSource } from 'typeorm';
import { CourseModule } from './course-module.entity';

export const courseModuleProviders = [
  {
    provide: 'CourseModuleRepository',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(CourseModule),
    inject: ['DataSource'],
  },
];
