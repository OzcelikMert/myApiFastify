import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiResult } from '@library/api/result';
import { LogMiddleware } from '@middlewares/log.middleware';
import { NavigationService } from '@services/db/navigation.service';
import {
  INavigationDeleteManySchema,
  INavigationGetWithIdSchema,
  INavigationGetManySchema,
  INavigationPostSchema,
  INavigationPutWithIdSchema,
  INavigationPutRankWithIdSchema,
  INavigationPutStatusManySchema,
} from '@schemas/navigation.schema';
import { INavigationModel } from 'types/models/navigation.model';
import { INavigationGetDetailedResultService } from 'types/services/db/navigation.service';
import { NavigationCacheService } from '@services/cache/navigation.cache.service';

const getWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<INavigationGetDetailedResultService>();

    const reqData = req as INavigationGetWithIdSchema;

    apiResult.data = await NavigationService.getDetailed({
      ...reqData.params,
      ...reqData.query,
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<INavigationGetDetailedResultService[]>();

    const reqData = req as INavigationGetManySchema;
    let isCachable = false;

    if (!req.isFromAdminPanel) {
      apiResult.data = await NavigationCacheService.get(reqData.query);
      isCachable = true;
    }

    if (apiResult.data == null) {
      apiResult.data = await NavigationService.getManyDetailed({
        ...reqData.query,
      });

      if (isCachable && apiResult.data.length > 0) {
        await NavigationCacheService.add(reqData.query, apiResult.data);
      }
    }

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const add = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<INavigationModel>();

    const reqData = req as INavigationPostSchema;

    apiResult.data = await NavigationService.add({
      ...reqData.body,
      authorId: req.sessionAuth!.user!.userId.toString(),
      lastAuthorId: req.sessionAuth!.user!.userId.toString(),
    });

    await NavigationCacheService.deleteAll({});

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updateWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as INavigationPutWithIdSchema;

    await NavigationService.update({
      ...reqData.params,
      ...reqData.body,
      lastAuthorId: req.sessionAuth!.user!.userId.toString(),
    });

    await NavigationCacheService.deleteAll({});

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updateRankWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as INavigationPutRankWithIdSchema;

    await NavigationService.updateRank({
      ...reqData.params,
      ...reqData.body,
      lastAuthorId: req.sessionAuth!.user!.userId.toString(),
    });

    await NavigationCacheService.deleteAll({});

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updateStatusMany = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as INavigationPutStatusManySchema;

    await NavigationService.updateStatusMany({
      ...reqData.body,
      lastAuthorId: req.sessionAuth!.user!.userId.toString(),
    });

    await NavigationCacheService.deleteAll({});

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const deleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as INavigationDeleteManySchema;

    await NavigationService.deleteMany({
      ...reqData.body,
    });

    await NavigationCacheService.deleteAll({});

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

export const NavigationController = {
  getWithId: getWithId,
  getMany: getMany,
  add: add,
  updateWithId: updateWithId,
  updateRankWithId: updateRankWithId,
  updateStatusMany: updateStatusMany,
  deleteMany: deleteMany,
};
