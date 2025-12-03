import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiResult } from '@library/api/result';
import { LogMiddleware } from '@middlewares/log.middleware';
import { IComponentGetDetailedResultService } from 'types/services/db/component.service';
import {
  IComponentDeleteManySchema,
  IComponentGetManySchema,
  IComponentGetWithKeySchema,
  IComponentGetWithIdSchema,
  IComponentPostSchema,
  IComponentPutWithIdSchema,
} from '@schemas/component.schema';
import { ComponentService } from '@services/db/component.service';
import { IComponentModel } from 'types/models/component.model';
import { ComponentCacheService } from '@services/cache/component.cache.service';

const getWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<IComponentGetDetailedResultService>();

    const reqData = req as IComponentGetWithIdSchema;

    apiResult.data = await ComponentService.getDetailed({
      ...reqData.params,
      ...reqData.query,
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const getWithKey = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<IComponentGetDetailedResultService>();

    const reqData = req as IComponentGetWithKeySchema;

    apiResult.data = await ComponentService.getDetailed({
      ...reqData.params,
      ...reqData.query,
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<IComponentGetDetailedResultService[]>();

    const reqData = req as IComponentGetManySchema;
    let isCachable = false;

    if (!req.isFromAdminPanel && reqData.query._id) {
      apiResult.data = await ComponentCacheService.getMany(reqData.query);
      if(apiResult.data && apiResult.data.length != reqData.query._id.length) {
        apiResult.data = null;
      }
      isCachable = true;
    }

    if (apiResult.data == null) {
      apiResult.data = await ComponentService.getManyDetailed({
        ...reqData.query,
      });

      if (isCachable && apiResult.data.length > 0) {
        await ComponentCacheService.addMany(apiResult.data);
      }
    }

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const add = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<IComponentModel>();

    const reqData = req as IComponentPostSchema;

    apiResult.data = await ComponentService.add({
      ...reqData.body,
      authorId: req.sessionAuth!.user!.userId.toString(),
      lastAuthorId: req.sessionAuth!.user!.userId.toString(),
    });

    await ComponentCacheService.deleteMany({});

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updateWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IComponentPutWithIdSchema;

    await ComponentService.update({
      ...reqData.params,
      ...reqData.body,
      lastAuthorId: req.sessionAuth!.user!.userId.toString(),
    });

    await ComponentCacheService.deleteMany({ _id: [reqData.params._id] });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const deleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IComponentDeleteManySchema;

    await ComponentService.deleteMany({
      ...reqData.body,
    });

    await ComponentCacheService.deleteMany(reqData.body);

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

export const ComponentController = {
  getWithId: getWithId,
  getWithKey: getWithKey,
  getMany: getMany,
  add: add,
  updateWithId: updateWithId,
  deleteMany: deleteMany,
};
