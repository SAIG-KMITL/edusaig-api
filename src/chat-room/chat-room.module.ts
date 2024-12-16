import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ChatRoomController } from './chat-room.controller';
import { ChatRoomService } from './chat-room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoom } from './chat-room.entity';
import { chatRoomProviders } from './chat-room.providers';
import { EnrollmentModule } from 'src/enrollment/enrollment.module';
import { ChatMessageModule } from 'src/chat-message/chat-message.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([ChatRoom]),
    EnrollmentModule,
    forwardRef(() => ChatMessageModule),
  ],
  controllers: [ChatRoomController],
  providers: [...chatRoomProviders, ChatRoomService],
  exports: [ChatRoomService],
})
export class ChatRoomModule {}
