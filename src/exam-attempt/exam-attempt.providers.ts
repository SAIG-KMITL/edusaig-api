import { DataSource } from 'typeorm';
import { ExamAttempt } from './exam-attempt.entity';

export const examAttemptProviders = [
  {
    provide: 'ExamAttemptRepository',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ExamAttempt),
    inject: ['DataSource'],
  },
];
