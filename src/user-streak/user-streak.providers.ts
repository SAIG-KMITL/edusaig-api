import { DataSource } from "typeorm";
import { UserStreak } from "./user-streak.entity";

export const userStreakProviders = [{
    provide: 'UserStreakRepository',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UserStreak),
    inject: ['DataSource'],
}];