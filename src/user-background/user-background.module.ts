import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBackgroundController } from './user-background.controller';
import { UserBackground } from './user-background.entity';
import { UserBackgroundService } from './user-background.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserBackground])],
  controllers: [UserBackgroundController],
  providers: [UserBackgroundService],
})
export class UserBackgroundModule {}
