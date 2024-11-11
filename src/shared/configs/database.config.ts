import { DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { GLOBAL_CONFIG } from '../constants/global-config.constant';
import 'dotenv/config';
import { User } from 'src/user/user.entity';
import { Category } from 'src/category/category.entity';

const configService = new ConfigService();

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: configService.get<string>(GLOBAL_CONFIG.DB_HOST),
  port: configService.get<number>(GLOBAL_CONFIG.DB_PORT),
  username: configService.get<string>(GLOBAL_CONFIG.DB_USERNAME),
  password: configService.get<string>(GLOBAL_CONFIG.DB_PASSWORD),
  database: configService.get<string>(GLOBAL_CONFIG.DB_DATABASE),
  logging: configService.get<boolean>(GLOBAL_CONFIG.IS_DEVELOPMENT),
  entities: [User, Category],
};
