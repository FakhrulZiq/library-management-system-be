import { ConfigModule, ConfigService } from "@nestjs/config";
import { Module } from "@nestjs/common";
import * as redisStore from "cache-manager-ioredis";
import * as Joi from "joi";
import { CacheModule } from "@nestjs/cache-manager";
import { RedisCacheService } from "./redisService";
import { TYPES } from "../constant";
import { ApplicationLogger } from "../logger";
import { RedisClientProvider } from "./redis.provider";

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validationSchema: Joi.object({
            REDIS_HOST: Joi.string().required(),
            REDIS_PORT: Joi.number().required(),
            REDIS_PASSWORD: Joi.string().required(),
          }),
        }),
      ],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>("REDIS_HOST"),
        port: configService.get<string>("REDIS_PORT"),
        tls: configService.get<string>("REDIS_TLS"),
        password: configService.get<string>("REDIS_PASSWORD"),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    RedisCacheService,
    RedisClientProvider,
    { provide: TYPES.IApplicationLogger, useClass: ApplicationLogger },
  ],
  exports: [CacheModule, RedisCacheService],
})
export class RedisCacheModule {}
