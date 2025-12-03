import { Config } from '@configs/index';
import { redis } from '@configs/redis';
import { RedisKey } from 'ioredis';
import {
  IPostManyParamCacheService,
  IPostParamCacheService,
} from 'types/services/cache/post.cache.service';
import {
  IPostGetDetailedResultService,
  IPostGetManyDetailedResultService,
} from 'types/services/db/post.service';

const KEY = 'post';
const getKey = (params: IPostParamCacheService) => {
  let key = `${KEY}:typeId:${params.typeId}`;
  params.langId = params.langId || Config.defaultLangId;

  if (params.langId) key += `:langId:${params.langId}`;
  if (params.url) key += `:url:${params.url}`;
  if (params.title) key += `:title:${params.title}`;
  if (params.categoryId) key += `:categoryId:${params.categoryId}`;
  if (params.authorId) key += `:authorId:${params.authorId}`;
  if (params.page) key += `:page:${params.page}`;
  if (params.count) key += `:count:${params.count}`;

  return key;
};
const getKeyMany = (params: IPostManyParamCacheService) => {
  let keys: RedisKey[] = [`${getKey({})}*`];

  if (params.typeId && params.typeId.length > 0) {
    keys = params.typeId.map((typeId) => {
      return getKey({ ...params, typeId });
    });
  }

  return keys;
};

const get = async <T>(params: IPostParamCacheService) => {
  const data = await redis.get(getKey(params));
  return data ? (JSON.parse(data) as T) : null;
};

const getMany = async <T>(params: IPostManyParamCacheService) => {
  const dataArray = (await redis.mget(getKeyMany(params))).filter(
    (data) => data != null
  );
  return dataArray.length > 0
    ? dataArray.map((data) => JSON.parse(data) as T)
    : null;
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
  const keys = await redis.keys(`${getKey(params)}*`);
  return await redis.del(keys);
};

export const PostCacheService = {
  get,
  getMany,
  add,
  deleteMany,
};
