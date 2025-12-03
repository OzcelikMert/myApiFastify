import config from 'config';
import Redis from 'ioredis';

const protocol = config.get<string>('redisProtocol');
const host = config.get<string>('redisHost');
const port = config.get<number>('redisPort');
const user = config.get<string>('redisUser');
const password = config.get<string>('redisPassword');

export function getRedisUri() {
  return `${protocol}://${host}${port ? `:${port}` : ''}`;
}

export async function redisConnect() {
  await redis.connect();
}

export const redis = new Redis({
  host: host,
  port: port,
  username: user || undefined,
  password: password || undefined,
  lazyConnect: true,
  enableReadyCheck: true,
});

redis.on('error', (err) => {
  console.error('Redis Connection Error:', err);
});
