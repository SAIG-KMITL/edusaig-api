import { ConfigService } from '@nestjs/config';
import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { GLOBAL_CONFIG } from '../constants/global-config.constant';

const configService = new ConfigService();

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>(GLOBAL_CONFIG.DB_HOST),
  port: configService.get<number>(GLOBAL_CONFIG.DB_PORT),
  username: configService.get<string>(GLOBAL_CONFIG.DB_USERNAME),
  password: configService.get<string>(GLOBAL_CONFIG.DB_PASSWORD),
  database: configService.get<string>(GLOBAL_CONFIG.DB_DATABASE),
  logging: configService.get<boolean>(GLOBAL_CONFIG.IS_DEVELOPMENT),
};

export default new DataSource(databaseConfig);
