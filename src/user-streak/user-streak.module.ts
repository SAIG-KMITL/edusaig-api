import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UserStreakController } from './user-streak.controller';
import { userStreakProviders } from './user-streak.providers';
import { UserStreakService } from './user-streak.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UserStreakController],
  providers: [...userStreakProviders, UserStreakService],
  exports: [UserStreakService],
})
export class UserStreakModule {}
