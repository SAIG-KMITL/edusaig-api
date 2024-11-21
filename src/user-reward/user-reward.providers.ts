import { DataSource } from 'typeorm';
import { UserReward } from './user-reward.entity';
import { User } from 'src/user/user.entity';
import { Reward } from 'src/reward/reward.entity';

export const UserRewardProviders = [
  {
    provide: 'UserRewardRepository',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserReward),
    inject: ['DataSource'],
  },
];
