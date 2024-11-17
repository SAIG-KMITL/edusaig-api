import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { RewardController } from './reward.controllers';
import { rewardProviders } from './reward.providers';
import { RewardService } from './reward.service';

@Module({
  imports: [DatabaseModule],
  controllers: [RewardController],
  providers: [...rewardProviders, RewardService],
  exports: [RewardService],
})
export class RewardModule {}
