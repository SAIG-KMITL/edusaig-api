import { DataSource } from 'typeorm';
import { Chapter } from './chapter.entity';

export const chapterProviders = [
  {
    provide: 'ChapterRepository',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Chapter),
    inject: ['DataSource'],
  },
];
