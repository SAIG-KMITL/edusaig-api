import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './chat-message.entity';
import { ChatMessageController } from './chat-message.controller';
import { ChatMessageService } from './chat-message.service';
import { chatMessageProviders } from './chat-message.providers';
import { ChatRoomModule } from 'src/chat-room/chat-room.module';
import { EnrollmentModule } from 'src/enrollment/enrollment.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([ChatMessage]),
    forwardRef(() => ChatRoomModule),
    EnrollmentModule,
    HttpModule,
  ],
  controllers: [ChatMessageController],
  providers: [...chatMessageProviders, ChatMessageService],
  exports: [ChatMessageService],
})
export class ChatMessageModule {}
