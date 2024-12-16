import { DataSource } from 'typeorm';
import { Pretest } from './pretest.entity';

export const pretestProviders = [
  {
    provide: 'PretestRepository',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Pretest),
    inject: ['DataSource'],
  },
];
