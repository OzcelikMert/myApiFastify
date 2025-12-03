import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiResult } from '@library/api/result';
import { ApiErrorCodes } from '@library/api/errorCodes';
import { ApiStatusCodes } from '@library/api/statusCodes';
import { PostTermService } from '@services/db/postTerm.service';
import { LogMiddleware } from '@middlewares/log.middleware';
import {
  IPostTermDeleteManySchema,
  IPostTermPutWithIdSchema,
} from '@schemas/postTerm.schema';
import { UserRoleId } from '@constants/userRoles';
import { PermissionUtil } from '@utils/permission.util';
import { IPostTermModel } from 'types/models/postTerm.model';

const checkWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IPostTermPutWithIdSchema;

    const serviceResult = await PostTermService.get({
      _id: reqData.params._id,
      postTypeId: reqData.body.postTypeId,
      typeId: reqData.body.typeId,
    });

    if (!serviceResult) {
      apiResult.status = false;
      apiResult.setErrorCode = ApiErrorCodes.notFound;
      apiResult.setStatusCode = ApiStatusCodes.notFound;
    } else {
      req.cachedAnyServiceResult = serviceResult;
    }

    if (!apiResult.status) {
      await reply.status(apiResult.getStatusCode).send(apiResult);
    }
  });
};

const checkMany = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IPostTermDeleteManySchema;

    const serviceResult = await PostTermService.getMany({
      _id: reqData.body._id,
      postTypeId: reqData.body.postTypeId,
      typeId: [reqData.body.typeId],
    });

    if (
      serviceResult.length === 0 ||
      serviceResult.length != reqData.body._id.length
    ) {
      apiResult.status = false;
      apiResult.setErrorCode = ApiErrorCodes.notFound;
      apiResult.setStatusCode = ApiStatusCodes.notFound;
    } else {
      req.cachedAnyServiceResult = serviceResult;
    }

    if (!apiResult.status) {
      await reply.status(apiResult.getStatusCode).send(apiResult);
    }
  });
};

const checkIsAuthorWithId = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IPostTermPutWithIdSchema;

    if (
      !PermissionUtil.checkPermissionRoleRank(
        req.sessionAuth!.user!.roleId,
        UserRoleId.Editor
      )
    ) {
      const postTerm = req.cachedAnyServiceResult as IPostTermModel;

      if (postTerm) {
        if (
          postTerm.authorId.toString() !=
          req.sessionAuth!.user?.userId.toString()
        ) {
          apiResult.status = false;
          apiResult.setErrorCode = ApiErrorCodes.noPerm;
          apiResult.setStatusCode = ApiStatusCodes.forbidden;
        }
      }
    }

    if (!apiResult.status) {
      await reply.status(apiResult.getStatusCode).send(apiResult);
    }
  });
};

const checkIsAuthorMany = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IPostTermDeleteManySchema;

    if (
      !PermissionUtil.checkPermissionRoleRank(
        req.sessionAuth!.user!.roleId,
        UserRoleId.Editor
      )
    ) {
      const postTerms = req.cachedAnyServiceResult as IPostTermModel[];

      if (postTerms) {
        for (const postTerm of postTerms) {
          if (
            postTerm.authorId.toString() !=
            req.sessionAuth!.user?.userId.toString()
          ) {
            apiResult.status = false;
            apiResult.setErrorCode = ApiErrorCodes.noPerm;
            apiResult.setStatusCode = ApiStatusCodes.forbidden;
            break;
          }
        }
      }
    }

    if (!apiResult.status) {
      await reply.status(apiResult.getStatusCode).send(apiResult);
    }
  });
};

export const PostTermMiddleware = {
  checkWithId: checkWithId,
  checkMany: checkMany,
  checkIsAuthorWithId: checkIsAuthorWithId,
  checkIsAuthorMany: checkIsAuthorMany,
};
