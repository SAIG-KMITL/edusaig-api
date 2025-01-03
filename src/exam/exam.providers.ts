import { DataSource } from 'typeorm';
import { Exam } from './exam.entity';

export const examProviders = [
  {
    provide: 'ExamRepository',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Exam),
    inject: ['DataSource'],
  },
];
