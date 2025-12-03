import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiResult } from '@library/api/result';
import { ApiErrorCodes } from '@library/api/errorCodes';
import { ApiStatusCodes } from '@library/api/statusCodes';
import { SubscriberService } from '@services/db/subscriber.service';
import { LogMiddleware } from '@middlewares/log.middleware';
import {
  ISubscriberDeleteWithIdSchema,
  ISubscriberDeleteManySchema,
  ISubscriberPostSchema,
  ISubscriberDeleteWithEmailSchema,
} from '@schemas/subscriber.schema';

const checkWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as ISubscriberDeleteWithIdSchema;

    const serviceResult = await SubscriberService.get({
      ...reqData.params,
    });

    if (serviceResult) {
      req.cachedAnyServiceResult = serviceResult;
    } else {
      apiResult.status = false;
      apiResult.setErrorCode = ApiErrorCodes.notFound;
      apiResult.setStatusCode = ApiStatusCodes.notFound;
    }

    if (!apiResult.status) {
      await reply.status(apiResult.getStatusCode).send(apiResult);
    }
  });
};

const checkMany = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as ISubscriberDeleteManySchema;

    const serviceResult = await SubscriberService.getMany({
      _id: reqData.body._id,
    });

    if (
      serviceResult.length == 0 ||
      serviceResult.length != reqData.body._id.length
    ) {
      apiResult.status = false;
      apiResult.setErrorCode = ApiErrorCodes.registeredData;
      apiResult.setStatusCode = ApiStatusCodes.conflict;
    } else {
      req.cachedAnyServiceResult = serviceResult;
    }

    if (!apiResult.status) {
      await reply.status(apiResult.getStatusCode).send(apiResult);
    }
  });
};

const checkWithEmail =
  (ifHasGetError?: true) =>
  async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
      const apiResult = new ApiResult();

      const reqData = req as ISubscriberPostSchema &
        ISubscriberDeleteWithEmailSchema;

      const serviceResult = await SubscriberService.get({
        ...reqData.body,
        ...reqData.params,
      });

      if (
        (ifHasGetError && serviceResult) ||
        (!ifHasGetError && !serviceResult)
      ) {
        apiResult.status = false;
        apiResult.setErrorCode = ApiErrorCodes.registeredData;
        apiResult.setStatusCode = ApiStatusCodes.conflict;
      }

      if (serviceResult) {
        req.cachedAnyServiceResult = serviceResult;
      }

      if (!apiResult.status) {
        await reply.status(apiResult.getStatusCode).send(apiResult);
      }
    });
  };

export const SubscribeMiddleware = {
  checkWithId: checkWithId,
  checkWithEmail: checkWithEmail,
  checkMany: checkMany,
};
