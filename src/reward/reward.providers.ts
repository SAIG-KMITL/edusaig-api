import { DataSource } from 'typeorm';
import { Reward } from './reward.entity';

export const rewardProviders = [
  {
    provide: 'RewardRepository',
    useFactory: (DataSource: DataSource) => DataSource.getRepository(Reward),
    inject: ['DataSource'],
  },
];
