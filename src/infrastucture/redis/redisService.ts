import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import { TYPES } from "../constant";
import { IContextAwareLogger } from "../logger";
import { IRedisService } from "./redisInterface";

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

  // public async keys(pattern: string): Promise<string[]> {
  //   return await this.cacheManager.store.keys(pattern);
  // }

  /**
   * Deletes keys from the Redis cache that match a given pattern.
   *
   * @param {string} pattern - The pattern to match for deleting keys.
   * @returns {Promise<void>} A promise that resolves when the keys have been deleted.
   */
  // public async deleteKeysByPattern(pattern: string): Promise<void> {
  //   try {
  //     const keys = await this.keys(pattern);

  //     if (keys.length === 0) {
  //       this._logger.log(
  //         "deleteKeysByPattern",
  //         `No keys found matching pattern: "${pattern}"`,
  //       );
  //       return;
  //     }

  //     await Promise.all(keys.map((key) => this.delete(key)));
  //     this._logger.log(
  //       "deleteKeysByPattern",
  //       `Deleted keys matching pattern: "${pattern}"`,
  //     );
  //   } catch (error: any) {
  //     this._logger.error(error.message, error);
  //     throw error;
  //   }
  // }
}
