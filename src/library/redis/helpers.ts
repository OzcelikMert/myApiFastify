import Redis from "ioredis";

export class RedisHelper {
  static async scanByPattern(redis: Redis, pattern: string, count: number = 100) {
    let cursor = '0';
    const keys: string[] = [];

    do {
      const reply = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
      cursor = reply[0];
      keys.push(...reply[1]);
    } while (cursor !== '0');

    return keys;
  }
}
