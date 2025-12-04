import { redis } from '@configs/redis';
import { RedisHelper } from '@library/redis/helpers';
import { IComponentParamCacheService } from 'types/services/cache/component.cache.service';
import { IComponentGetDetailedResultService } from 'types/services/db/component.service';

const KEY = 'component';

const getKey = (
  params: IComponentParamCacheService,
  relate: boolean = false
) => {
  let key = KEY;

  if (params.langId) key += `:langId:${params.langId}`;
  if (params.typeId) key += `:typeId:${params.typeId}`;
  if (params._id) key += `:id:${params._id.join(',')}`;

  return !relate ? key : `${key}*`;
};

const get = async (params: IComponentParamCacheService) => {
  const data = await redis.get(getKey(params));
  return data
    ? (JSON.parse(data) as IComponentGetDetailedResultService[])
    : null;
};

const add = async (
  params: IComponentParamCacheService,
  data: IComponentGetDetailedResultService[],
  expirationInSeconds: number = Date.convertDaysToSeconds(1)
) => {
  return await redis.setex(
    getKey(params),
    expirationInSeconds,
    JSON.stringify(data)
  );
};

const deleteMany = async (params: IComponentParamCacheService) => {
  const keys = await RedisHelper.scanByPattern(redis, `${KEY}:*`);
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

export const ComponentCacheService = {
  get,
  add,
  deleteMany,
  deleteAll,
};
