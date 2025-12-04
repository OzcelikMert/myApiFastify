import { redis } from '@configs/redis';
import { RedisHelper } from '@library/redis/helpers';
import { INavigationParamCacheService } from 'types/services/cache/navigation.cache.service';
import { INavigationGetDetailedResultService } from 'types/services/db/navigation.service';

const KEY = 'navigation';
const getKey = (
  params: INavigationParamCacheService,
  relate: boolean = false
) => {
  let key = KEY;

  if (params.langId) key += `:langId:${params.langId}`;
  if (params.isPrimary) key += `:primary`;
  if (params.isSecondary) key += `:secondary`;

  return !relate ? key : `${key}*`;
};

const get = async (params: INavigationParamCacheService) => {
  const data = await redis.get(getKey(params));
  return data
    ? (JSON.parse(data) as INavigationGetDetailedResultService[])
    : null;
};

const add = async (
  params: INavigationParamCacheService,
  data: INavigationGetDetailedResultService[],
  expirationInSeconds: number = Date.convertDaysToSeconds(1)
) => {
  return await redis.setex(
    getKey(params),
    expirationInSeconds,
    JSON.stringify(data)
  );
};

const deleteMany = async (params: INavigationParamCacheService) => {
  const keys = await RedisHelper.scanByPattern(redis, getKey(params, true));
  if (keys.length > 0) {
    return await redis.del(keys);
  }
  return 0;
};

const deleteAll = async () => {
  const keys = await RedisHelper.scanByPattern(redis, `${KEY}:*`);
  if (keys.length > 0) {
    return await redis.del(keys);
  }
  return 0;
};

export const NavigationCacheService = {
  get,
  add,
  deleteMany,
  deleteAll,
};
