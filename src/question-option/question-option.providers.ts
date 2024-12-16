import { DataSource } from 'typeorm';
import { QuestionOption } from './question-option.entity';

export const questionOptionProviders = [
  {
    provide: 'QuestionOptionRepository',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(QuestionOption),
    inject: ['DataSource'],
  },
];
