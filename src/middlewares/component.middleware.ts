import { FastifyReply, FastifyRequest } from 'fastify';
import { ApiResult } from '@library/api/result';
import { ApiErrorCodes } from '@library/api/errorCodes';
import { ApiStatusCodes } from '@library/api/statusCodes';
import { LogMiddleware } from '@middlewares/log.middleware';
import {
  IComponentDeleteManySchema,
  IComponentPutWithIdSchema,
} from '@schemas/component.schema';
import { ComponentService } from '@services/component.service';
import { PermissionUtil } from '@utils/permission.util';
import { UserRoleId } from '@constants/userRoles';
import { IComponentModel } from 'types/models/component.model';

const checkWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IComponentPutWithIdSchema;

    const serviceResult = await ComponentService.get({
      _id: reqData.params._id,
    });

    if (!serviceResult) {
      apiResult.status = false;
      apiResult.setErrorCode = ApiErrorCodes.notFound;
      apiResult.setStatusCode = ApiStatusCodes.notFound;
    } else {
      req.cachedServiceResult = serviceResult;
    }

    if (!apiResult.status) {
      await reply.status(apiResult.getStatusCode).send(apiResult);
    }
  });
};

const checkMany = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IComponentDeleteManySchema;

    const serviceResult = await ComponentService.getMany({
      _id: reqData.body._id,
    });

    if (
      serviceResult.length == 0 ||
      serviceResult.length != reqData.body._id.length
    ) {
      apiResult.status = false;
      apiResult.setErrorCode = ApiErrorCodes.notFound;
      apiResult.setStatusCode = ApiStatusCodes.notFound;
    } else {
      req.cachedServiceResult = serviceResult;
    }

    if (!apiResult.status) {
      await reply.status(apiResult.getStatusCode).send(apiResult);
    }
  });
};

const checkPermissionWithId = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IComponentPutWithIdSchema;

    if (
      !PermissionUtil.checkPermissionRoleRank(
        req.sessionAuth!.user!.roleId,
        UserRoleId.SuperAdmin
      )
    ) {
      const serviceResult = req.cachedServiceResult as IComponentModel;

      const reqToCheck = {
        key: reqData.body.key,
        typeId: reqData.body.typeId,
        title: reqData.body.title,
        elements: reqData.body.elements.map((item) => ({
          _id: item._id,
          key: item.key,
          rank: item.rank,
          title: item.title,
          typeId: item.typeId,
        })),
      };

      const serviceToCheck = {
        key: serviceResult.key,
        typeId: serviceResult.typeId,
        title: serviceResult.title,
        elements: serviceResult.elements.map((item) => ({
          _id: item._id,
          key: item.key,
          rank: item.rank,
          title: item.title,
          typeId: item.typeId,
        })),
      };

      if (JSON.stringify(reqToCheck) != JSON.stringify(serviceToCheck)) {
        apiResult.status = false;
        apiResult.setErrorCode = ApiErrorCodes.noPerm;
        apiResult.setStatusCode = ApiStatusCodes.forbidden;
      }
    }

    if (!apiResult.status) {
      await reply.status(apiResult.getStatusCode).send(apiResult);
    }
  });
};

export const ComponentMiddleware = {
  checkWithId: checkWithId,
  checkMany: checkMany,
  checkPermissionWithId: checkPermissionWithId,
};
