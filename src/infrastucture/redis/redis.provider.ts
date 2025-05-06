import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const RedisClientProvider: Provider = {
  provide: 'REDIS_CLIENT',
  useFactory: async (configService: ConfigService) => {
    const client = new Redis({
      host: configService.get<string>('REDIS_HOST'),
      port: configService.get<number>('REDIS_PORT'),
    });
    return client;
  },
  inject: [ConfigService],
};
