import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { RewardController } from './reward.controllers';
import { rewardProviders } from './reward.providers';
import { RewardService } from './reward.service';
import { FileModule } from 'src/file/file.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reward } from './reward.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Reward]), FileModule],
  controllers: [RewardController],
  providers: [...rewardProviders, RewardService],
  exports: [RewardService],
})
export class RewardModule {}
