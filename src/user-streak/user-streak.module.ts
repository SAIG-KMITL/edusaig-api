import { Module } from "@nestjs/common";
import { UserStreakController } from "./user-streak.controller";
import { UserStreakService } from "./user-streak.service";
import { DatabaseModule } from "src/database/database.module";
import { userStreakProviders } from "./user-streak.providers";

@Module({
    imports: [
        DatabaseModule,
    ],
    controllers: [UserStreakController],
    providers: [
        ...userStreakProviders,
        UserStreakService
    ],
    exports: [UserStreakService],
})
export class UserStreakModule { }