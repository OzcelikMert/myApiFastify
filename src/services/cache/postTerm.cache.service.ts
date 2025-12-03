import { Config } from '@configs/index';
import { redis } from '@configs/redis';
import {
  IPostTermParamCacheService,
} from 'types/services/cache/postTerm.cache.service';
import { IPostTermGetDetailedResultService } from 'types/services/db/postTerm.service';

const KEY = 'postTerm';
const getKey = (params: IPostTermParamCacheService) => {
  let key = `${KEY}:typeId:${params.typeId}:postTypeId:${params.postTypeId}`;
  params.langId = params.langId || Config.defaultLangId;

  if (params.langId) key += `:langId:${params.langId}`;
  if (params.page) key += `:page:${params.page}`;
  if (params.count) key += `:count:${params.count}`;

  return key;
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
  const keys = await redis.keys(`${getKey(params)}*`);
  return await redis.del(keys);
};

export const PostTermCacheService = {
  get,
  add,
  deleteMany,
};
