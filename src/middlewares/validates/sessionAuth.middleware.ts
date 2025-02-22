import { FastifyReply, FastifyRequest } from 'fastify';
import { ApiResult } from '@library/api/result';
import { ApiErrorCodes } from '@library/api/errorCodes';
import { ApiStatusCodes } from '@library/api/statusCodes';
import { UserService } from '@services/user.service';
import { StatusId } from '@constants/status';
import {
  sessionAuthRefreshMinutes,
  sessionAuthTTLMinutes,
} from '@configs/session/session.auth.config';
import { SessionAuthUtil } from '@utils/sessinAuth.util';
import { LogMiddleware } from '@middlewares/log.middleware';
import { IUserModel } from 'types/models/user.model';
import { ISessionAuthUser } from 'types/services/sessionAuth.service';

const check = async (req: FastifyRequest, res: FastifyReply) => {
  await LogMiddleware.error(req, res, async () => {
    const apiResult = new ApiResult();
    if (req.sessionAuth && req.sessionAuth.user) {
      let status = true;

      const user = req.cachedServiceResult as IUserModel;
      if (user) {
        const token = SessionAuthUtil.createToken(
          user._id.toString(),
          user.username,
          user.password,
          req.ip
        );

        if (req.sessionAuth._id != token) {
          status = false;
        }
      } else {
        status = false;
      }

      if (!status) {
        await new Promise((resolve) => {
          req.sessionAuth!.delete();
          resolve(1);
        });
        apiResult.status = false;
        apiResult.setErrorCode = ApiErrorCodes.notLoggedIn;
        apiResult.setStatusCode = ApiStatusCodes.unauthorized;
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

const reload = async (req: FastifyRequest, res: FastifyReply) => {
  await LogMiddleware.error(req, res, async () => {
    if (req.sessionAuth && req.sessionAuth.user) {
      const date = new Date();
      if (
        Number(
          date.diffMinutes(new Date(req.sessionAuth.user.refreshedAt ?? ''))
        ) > sessionAuthTTLMinutes
      ) {
        req.sessionAuth.delete();
      } else {
        const serviceResult = await UserService.get({
          _id: req.sessionAuth.user.userId.toString(),
          statusId: StatusId.Active,
        });
        if (serviceResult) {
          req.cachedServiceResult = serviceResult;
          const sessionAuthUser: ISessionAuthUser = {
            ...req.sessionAuth.user,
            userId: serviceResult._id.toString(),
            username: serviceResult.username,
            email: serviceResult.email,
            name: serviceResult.name,
            url: serviceResult.url ?? '',
            image: serviceResult.image,
            roleId: serviceResult.roleId,
            ip: req.ip,
            permissions: serviceResult.permissions,
            createdAt: date,
            updatedAt: date,
          };

          if (
            JSON.stringify(sessionAuthUser) !=
              JSON.stringify(req.sessionAuth.user) ||
            Number(
              date.diffMinutes(new Date(req.sessionAuth.user.refreshedAt ?? ''))
            ) > sessionAuthRefreshMinutes
          ) {
            const token = SessionAuthUtil.createToken(
              serviceResult._id.toString(),
              serviceResult.username,
              serviceResult.password,
              req.ip
            );
            req.sessionAuth.set('_id', token);
            req.sessionAuth.set('user', {
              ...sessionAuthUser,
              refreshedAt: date,
            });
          }
        }
      }
    }
  });
};

export const SessionAuthMiddleware = {
  check: check,
  reload: reload,
};
