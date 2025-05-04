import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { TYPES } from '../constant';
import { IContextAwareLogger } from '../logger';
import { IRedisService } from './redisInterface';

@Injectable()
export class RedisCacheService implements IRedisService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(TYPES.IApplicationLogger)
    private readonly _logger: IContextAwareLogger,
  ) {}

  public async get(key: string): Promise<unknown> {
    return await this.cacheManager.get(key);
  }

  public async set(key: string, value: object, ttl?: number) {
    return await this.cacheManager.set(key, value, ttl);
  }

  public async delete(key: string) {
    return await this.cacheManager.del(key);
  }
}
