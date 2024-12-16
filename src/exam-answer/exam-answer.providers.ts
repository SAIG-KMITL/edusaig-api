import { DataSource } from 'typeorm';
import { ExamAnswer } from './exam-answer.entity';

export const examAnswerProviders = [
  {
    provide: 'ExamAnswerRepository',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ExamAnswer),
    inject: ['DataSource'],
  },
];
