import { Config } from '@configs/index';
import { redis } from '@configs/redis';
import { RedisKey } from 'ioredis';
import {
  IComponentManyParamCacheService,
  IComponentParamCacheService,
} from 'types/services/cache/component.cache.service';
import { IComponentGetDetailedResultService } from 'types/services/db/component.service';

const KEY = 'component';

const getKey = (params: IComponentParamCacheService) => {
  let key = `${KEY}`;
  params.langId = params.langId || Config.defaultLangId;

  if (params.langId) key += `:langId:${params.langId}`;
  if (params._id) key += `:id:${params._id}`;

  return key;
};

const getKeyMany = (params: IComponentManyParamCacheService) => {
  let keys: RedisKey[] = [`${getKey({})}*`];

  if (params._id && params._id.length > 0) {
    keys = params._id.map((_id) => {
      return getKey({ _id });
    });
  }

  return keys;
};

const get = async (params: IComponentParamCacheService) => {
  const data = await redis.get(getKey(params));
  return data ? (JSON.parse(data) as IComponentGetDetailedResultService) : null;
};

const getMany = async (params: IComponentManyParamCacheService) => {
  const dataArray = (await redis.mget(getKeyMany(params))).filter(
    (data) => data != null
  );
  return dataArray.length > 0
    ? dataArray.map(
        (data) => JSON.parse(data) as IComponentGetDetailedResultService
      )
    : null;
};

const add = async (
  params: IComponentParamCacheService,
  data: IComponentGetDetailedResultService,
  expirationInSeconds: number = Date.convertDaysToSeconds(1)
) => {
  return await redis.setex(
    getKey(params),
    expirationInSeconds,
    JSON.stringify(data)
  );
};

const addMany = async (
  dataArray: IComponentGetDetailedResultService[],
  expirationInSeconds: number = Date.convertDaysToSeconds(1)
) => {
  const pipe = redis.pipeline();

  for (const data of dataArray) {
    pipe.setex(
      getKey({ _id: data._id?.toString() }),
      expirationInSeconds,
      JSON.stringify(data)
    );
  }

  return await pipe.exec();
};

const deleteMany = async (params: IComponentManyParamCacheService) => {
  const pipe = redis.pipeline();

  for (const key of getKeyMany(params)) {
    const keys = await redis.keys(`${key}*`);
    pipe.del(keys);
  }

  return await pipe.exec();
};

export const ComponentCacheService = {
  get,
  getMany,
  add,
  addMany,
  deleteMany,
};
