import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserReward } from './user-reward.entity';
import { UserRewardController } from './user-reward.controllers';
import { UserRewardService } from './user-reward.service';
import { UserRewardProviders } from './user-reward.providers';
import { DatabaseModule } from 'src/database/database.module';
import { User } from 'src/user/user.entity';
import { Reward } from 'src/reward/reward.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([UserReward, User, Reward]),
  ],
  controllers: [UserRewardController],
  providers: [...UserRewardProviders, UserRewardService],
  exports: [UserRewardService],
})
export class UserRewardModule {}
