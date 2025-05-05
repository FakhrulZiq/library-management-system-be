export interface IRedisService {
  get(key: string): Promise<unknown>;
  set(key: string, value: object, ttl?: number);
  delete(key: string);
}
