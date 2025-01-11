import { IAuthPostSchema } from '@schemas/auth.schema';
import { UserService } from '@services/user.service';
import { StatusId } from '@constants/status';
import { LogMiddleware } from '@middlewares/log.middleware';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ApiResult } from '@library/api/result';
import { ApiErrorCodes } from '@library/api/errorCodes';
import { ApiStatusCodes } from '@library/api/statusCodes';
import { SessionAuthUtil } from '@utils/sessinAuth.util';
import { ISessionAuth, ISessionAuthUser } from 'types/services/sessionAuth.service';

const getSession = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<ISessionAuth>();

    apiResult.data = {
      _id: req.sessionAuth!._id,
      user: req.sessionAuth!.user!,
    };

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const login = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<ISessionAuthUser>();

    const reqData = req as IAuthPostSchema;

    const user = await UserService.get(
      {
        ...reqData.body,
      }
    );

    if (user) {
      if (user.statusId == StatusId.Active) {
        const date = new Date();
        const token = SessionAuthUtil.createToken(
          user._id.toString(),
          user.email,
          user.password!,
          req.ip
        );
        req.sessionAuth?.set('_id', token);

        const sessionAuthUser: ISessionAuthUser = {
          userId: user._id.toString(),
          email: user.email,
          name: user.name,
          url: user.url ?? "",
          image: user.image,
          roleId: user.roleId,
          ip: req.ip,
          permissions: user.permissions,
          createdAt: date,
          updatedAt: date,
          refreshedAt: date,
        }

        req.sessionAuth!.set('user', sessionAuthUser);
        apiResult.data = sessionAuthUser;
      } else {
        apiResult.status = false;
        apiResult.setErrorCode = ApiErrorCodes.noPerm;
        apiResult.setStatusCode = ApiStatusCodes.notFound;
      }
    } else {
      apiResult.status = false;
      apiResult.setErrorCode = ApiErrorCodes.notFound;
      apiResult.setStatusCode = ApiStatusCodes.notFound;
    }

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const logOut = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    req.sessionAuth!.delete();
    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

export const AuthController = {
  getSession: getSession,
  login: login,
  logOut: logOut,
};
