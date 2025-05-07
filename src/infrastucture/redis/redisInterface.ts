export interface IRedisService {
  get(key: string): Promise<unknown>;
  set(key: string, value: object, ttl?: number);
  keys(pattern: string): Promise<string[]>;
  deleteMany(keys: string[]): Promise<void>;
}
