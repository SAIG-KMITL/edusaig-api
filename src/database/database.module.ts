import { Module } from "@nestjs/common";
import { databaseProviders } from "./database.provoders";

@Module({
    providers: [...databaseProviders],
    exports: [...databaseProviders]
})
export class DatabaseModule { }