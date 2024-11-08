import { DataSource } from "typeorm";
import { databaseConfig } from "../shared/configs/database.config";

export const databaseProviders = [
    {
        provide: "DataSource",
        useFactory: async () => {
            return await new DataSource(databaseConfig).initialize();
        },
    },
];