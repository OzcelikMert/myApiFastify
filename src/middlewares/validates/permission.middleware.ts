import { FastifyReply, FastifyRequest } from 'fastify';
import { ApiResult } from '@library/api/result';
import { ApiErrorCodes } from '@library/api/errorCodes';
import { ApiStatusCodes } from '@library/api/statusCodes';
import {
  IEndPointPermissionFunc,
  IEndPointPermission,
} from 'types/constants/endPoint.permissions';
import { PermissionUtil } from '@utils/permission.util';
import { LogMiddleware } from '@middlewares/log.middleware';
import { UserRoleId } from '@constants/userRoles';
import { IUserModel } from 'types/models/user.model';

const check =
  (permission: IEndPointPermission | IEndPointPermissionFunc) =>
  async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
      const apiResult = new ApiResult();

      const permissionData =
        typeof permission == 'function' ? permission(req) : permission;

      const user = req.cachedUserServiceResult as IUserModel;

      if (req.isAuthenticated && user) {
        if (
          !PermissionUtil.checkPermissionRoleRank(
            user.roleId,
            permissionData.userRoleId
          ) ||
          !PermissionUtil.checkPermissionId(
            user.roleId,
            user.permissions,
            permissionData.permissionId
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

      if (!apiResult.status) {
        await reply.status(apiResult.getStatusCode).send(apiResult);
      }
    });
  };

const checkUserRole =
  (roleId: UserRoleId) => async (req: FastifyRequest, res: FastifyReply) => {
    await LogMiddleware.error(req, res, async () => {
      const apiResult = new ApiResult();

      if (req.isAuthenticated && req.sessionAuth && req.sessionAuth.user) {
        const user = req.cachedUserServiceResult as IUserModel;
        if (
          !PermissionUtil.checkPermissionRoleRank(
            user.roleId,
            roleId
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

      if (!apiResult.status) {
        res.status(apiResult.getStatusCode).send(apiResult);
      }
    });
  };

export const PermissionMiddleware = {
  check: check,
  checkUserRole: checkUserRole,
};
