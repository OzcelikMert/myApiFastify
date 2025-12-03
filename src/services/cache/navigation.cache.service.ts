import { Config } from '@configs/index';
import { redis } from '@configs/redis';
import { INavigationParamCacheService } from 'types/services/cache/navigation.cache.service';
import { INavigationGetDetailedResultService } from 'types/services/db/navigation.service';

const KEY = 'navigation';
const getKey = (params: INavigationParamCacheService) => {
  let key = `${KEY}`;
  params.langId = params.langId || Config.defaultLangId;


  if (params.langId) key += `:langId:${params.langId}`;
  if (params.isPrimary) key += `:primary`;
  if (params.isSecondary) key += `:secondary`;

  return key;
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

const deleteAll = async (params: INavigationParamCacheService) => {
  const keys = await redis.keys(`${getKey(params)}*`);
  return await redis.del(keys);
};

export const NavigationCacheService = {
  get,
  add,
  deleteAll,
};
