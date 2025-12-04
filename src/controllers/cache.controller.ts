import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiResult } from '@library/api/result';
import { LogMiddleware } from '@middlewares/log.middleware';
import { PostCacheService } from '@services/cache/post.cache.service';
import { PostTermCacheService } from '@services/cache/postTerm.cache.service';
import { ComponentCacheService } from '@services/cache/component.cache.service';
import { NavigationCacheService } from '@services/cache/navigation.cache.service';

const deleteAll = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<boolean>();

    await PostCacheService.deleteAll();
    await PostTermCacheService.deleteAll();
    await ComponentCacheService.deleteAll();
    await NavigationCacheService.deleteAll();

    apiResult.data = true;

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

export const CacheController = {
  deleteAll,
};
