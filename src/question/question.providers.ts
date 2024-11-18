import { DataSource } from 'typeorm';
import { Question } from './question.entity';

export const questionProviders = [
  {
    provide: 'QuestionRepository',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Question),
    inject: ['DataSource'],
  },
];
