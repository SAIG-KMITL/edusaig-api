import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBackgroundTopicController } from './user-background-topic.controller';
import { UserBackgroundTopic } from './user-background-topic.entity';
import { UserBackgroundTopicService } from './user-background-topic.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserBackgroundTopic])],
  controllers: [UserBackgroundTopicController],
  providers: [UserBackgroundTopicService],
})
export class UserBackgroundTopicModule {}
