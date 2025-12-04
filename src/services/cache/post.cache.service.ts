import { redis } from '@configs/redis';
import { RedisHelper } from '@library/redis/helpers';
import { IPostParamCacheService } from 'types/services/cache/post.cache.service';
import {
  IPostGetDetailedResultService,
  IPostGetManyDetailedResultService,
} from 'types/services/db/post.service';

const KEY = 'post';
const getKey = (params: IPostParamCacheService, relate: boolean = false) => {
  let key = `${KEY}:typeId:${params.typeId}`;

  if (params.langId) key += `:langId:${params.langId}`;
  if (params.sortTypeId) key += `:sortTypeId:${params.sortTypeId}`;
  if (params.url) key += `:url:${params.url}`;
  if (params.count) key += `:count:${params.count}`;
  if (params.page) key += `:page:${params.page}`;

  return !relate ? key : `${key}*`;
};

const get = async <T>(params: IPostParamCacheService) => {
  const data = await redis.get(getKey(params));
  return data ? (JSON.parse(data) as T) : null;
};

const add = async (
  params: IPostParamCacheService,
  data: IPostGetDetailedResultService | IPostGetManyDetailedResultService[],
  expirationInSeconds: number = Date.convertDaysToSeconds(1)
) => {
  return await redis.setex(
    getKey(params),
    expirationInSeconds,
    JSON.stringify(data)
  );
};

const deleteMany = async (params: IPostParamCacheService) => {
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

export const PostCacheService = {
  get,
  add,
  deleteMany,
  deleteAll,
};
