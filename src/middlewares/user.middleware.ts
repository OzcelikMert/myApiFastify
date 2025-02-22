import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiResult } from '@library/api/result';
import { ApiErrorCodes } from '@library/api/errorCodes';
import { ApiStatusCodes } from '@library/api/statusCodes';
import { UserService } from '@services/user.service';
import { LogMiddleware } from '@middlewares/log.middleware';
import {
  IUserPutWithIdSchema,
  IUserPutPasswordSchema,
} from '@schemas/user.schema';
import { PermissionUtil } from '@utils/permission.util';

const checkWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IUserPutWithIdSchema;

    const serviceResult = await UserService.get({
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

const checkRoleRank = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IUserPutWithIdSchema;
    let userRoleId = 0;

    if (reqData.body.roleId) {
      userRoleId = reqData.body.roleId;
    } else if (reqData.params._id) {
      const user = await UserService.get({
        _id: reqData.params._id,
      });
      if (user) {
        userRoleId = user.roleId;
      }
    }

    if (userRoleId > 0) {
      if (req.sessionAuth && req.sessionAuth.user) {
        const sessionUser = await UserService.get({
          _id: req.sessionAuth.user.userId.toString(),
        });

        if (
          PermissionUtil.checkPermissionRoleRank(
            userRoleId,
            sessionUser!.roleId,
            false
          )
        ) {
          apiResult.status = false;
          apiResult.setErrorCode = ApiErrorCodes.noPerm;
          apiResult.setStatusCode = ApiStatusCodes.forbidden;
        }
      } else {
        apiResult.status = false;
        apiResult.setErrorCode = ApiErrorCodes.notLoggedIn;
        apiResult.setStatusCode = ApiStatusCodes.unauthorized;
      }
    } else {
      apiResult.status = false;
      apiResult.setErrorCode = ApiErrorCodes.incorrectData;
      apiResult.setStatusCode = ApiStatusCodes.badRequest;
    }

    if (!apiResult.status) {
      await reply.status(apiResult.getStatusCode).send(apiResult);
    }
  });
};

const checkRegisteredUsername = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IUserPutWithIdSchema;

    if (reqData.body.username) {
      const serviceResult = await UserService.get({
        username: reqData.body.username,
        ignoreUserId: reqData.params._id ? [reqData.params._id] : undefined,
      });

      if (serviceResult) {
        apiResult.status = false;
        apiResult.setErrorCode = ApiErrorCodes.registeredData;
        apiResult.setStatusCode = ApiStatusCodes.conflict;
      }
    }

    if (!apiResult.status) {
      await reply.status(apiResult.getStatusCode).send(apiResult);
    }
  });
};

const checkPasswordWithSessionUsername = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IUserPutPasswordSchema;

    const serviceResult = await UserService.get({
      username: req.sessionAuth!.user?.username,
      password: reqData.body.password,
    });

    if (!serviceResult) {
      apiResult.status = false;
      apiResult.setErrorCode = ApiErrorCodes.notFound;
      apiResult.setStatusCode = ApiStatusCodes.notFound;
    }

    if (!apiResult.status) {
      await reply.status(apiResult.getStatusCode).send(apiResult);
    }
  });
};

export const UserMiddleware = {
  checkWithId: checkWithId,
  checkRoleRank: checkRoleRank,
  checkRegisteredUsername: checkRegisteredUsername,
  checkPasswordWithSessionUsername: checkPasswordWithSessionUsername,
};
