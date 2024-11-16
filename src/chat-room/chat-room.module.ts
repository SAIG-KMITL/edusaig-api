import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { ChatRoomController } from "./chat-room.controller";
import { ChatRoomService } from "./chat-room.service";

@Module({
    imports: [
        DatabaseModule,
    ],
    controllers: [ChatRoomController],
    providers: [ChatRoomService],
})
export class ChatRoomModule { }