import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatMessage } from "./chat-message.entity";
import { ChatMessageController } from "./chat-message.controller";
import { ChatMessageService } from "./chat-message.service";
import { chatMessageProviders } from "./chat-message.providers";

@Module({
    imports: [
        DatabaseModule,
        TypeOrmModule.forFeature([ChatMessage]),
    ],
    controllers: [ChatMessageController],
    providers: [
        ...chatMessageProviders,
        ChatMessageService,
    ],
})
export class ChatMessageModule { }