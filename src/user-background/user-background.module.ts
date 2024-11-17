import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBackgroundTopicModule } from 'src/user-background-topic/user-background-topic.module';
import { UserBackgroundController } from './user-background.controller';
import { UserBackground } from './user-background.entity';
import { UserBackgroundService } from './user-background.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserBackground]),
    UserBackgroundTopicModule,
  ],
  controllers: [UserBackgroundController],
  providers: [UserBackgroundService],
  exports: [UserBackgroundService],
})
export class UserBackgroundModule {}
