import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ChatRoomController } from './chat-room.controller';
import { ChatRoomService } from './chat-room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './chat-room.entity';
import { chatRoomProviders } from './chat-room.providers';
import { EnrollmentModule } from 'src/enrollment/enrollment.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([ChatRoom]),
    EnrollmentModule,
  ],
  controllers: [ChatRoomController],
  providers: [...chatRoomProviders, ChatRoomService],
  exports: [ChatRoomService],
})
export class ChatRoomModule {}
