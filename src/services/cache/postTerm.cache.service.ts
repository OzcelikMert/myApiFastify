import { redis } from '@configs/redis';
import { RedisHelper } from '@library/redis/helpers';
import { IPostTermParamCacheService } from 'types/services/cache/postTerm.cache.service';
import { IPostTermGetDetailedResultService } from 'types/services/db/postTerm.service';

const KEY = 'postTerm';
const getKey = (
  params: IPostTermParamCacheService,
  relate: boolean = false
) => {
  let key = `${KEY}:typeId:${params.typeId}:postTypeId:${params.postTypeId}`;

  if (params.langId) key += `:langId:${params.langId}`;
  if (params.page) key += `:page:${params.page}`;
  if (params.count) key += `:count:${params.count}`;

  return !relate ? key : `${key}*`;
};
const get = async <T>(params: IPostTermParamCacheService) => {
  const data = await redis.get(getKey(params));
  return data ? (JSON.parse(data) as T) : null;
};

const add = async (
  params: IPostTermParamCacheService,
  data: IPostTermGetDetailedResultService | IPostTermGetDetailedResultService[],
  expirationInSeconds: number = Date.convertDaysToSeconds(1)
) => {
  return await redis.setex(
    getKey(params),
    expirationInSeconds,
    JSON.stringify(data)
  );
};

const deleteMany = async (params: IPostTermParamCacheService) => {
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

export const PostTermCacheService = {
  get,
  add,
  deleteMany,
  deleteAll,
};
