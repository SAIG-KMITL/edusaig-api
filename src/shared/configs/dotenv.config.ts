import * as Joi from 'joi';
import { Environment } from '../enums/environment.enum';

export const dotenvConfig = Joi.object({
    PORT: Joi.number().required(),
    NODE_ENV: Joi.string()
        .valid(...Object.values(Environment))
        .default(Environment.DEVELOPMENT),
    IS_DEVELOPMENT: Joi.boolean().when('NODE_ENV', {
        is: Joi.equal(Environment.DEVELOPMENT),
        then: Joi.boolean().default(true),
        otherwise: Joi.boolean().default(false),
    }),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_DATABASE: Joi.string().required(),
    CORS_ALLOW_ORIGIN: Joi.string().required(),
    JWT_ACCESS_SECRET: Joi.string().required(),
    JWT_REFRESH_SECRET: Joi.string().required(),
    JWT_ACCESS_EXPIRATION: Joi.string().required(),
    JWT_REFRESH_EXPIRATION: Joi.string().required(),
    AWS_ACCESS_KEY_ID: Joi.string().required(),
    AWS_SECRET_ACCESS_KEY: Joi.string().required(),
    AWS_REGION: Joi.string().required(),
    AWS_BUCKET_NAME: Joi.string().required(),
  ADMIN_EMAIL: Joi.string().required(),
  ADMIN_PASSWORD: Joi.string().required(),
    JWT_AI_ACCESS_SECRET: Joi.string().required(),
});
