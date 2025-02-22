import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiResult } from '@library/api/result';
import {
  IUserDeleteWithIdSchema,
  IUserGetWithIdSchema,
  IUserGetManySchema,
  IUserPostSchema,
  IUserPutWithIdSchema,
  IUserPutPasswordSchema,
  IUserPutProfileSchema,
  IUserGetWithURLSchema,
  IUserPutProfileImageSchema,
} from '@schemas/user.schema';
import { UserService } from '@services/user.service';
import { LogMiddleware } from '@middlewares/log.middleware';
import { IUserGetDetailedResultService } from 'types/services/user.service';
import { IUserModel } from 'types/models/user.model';
import { SessionAuthUtil } from '@utils/sessinAuth.util';
import { ApiErrorCodes } from '@library/api/errorCodes';
import { ApiStatusCodes } from '@library/api/statusCodes';
import { ISessionAuth } from 'types/services/sessionAuth.service';

const getWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<IUserGetDetailedResultService>();

    const reqData = req as IUserGetWithIdSchema;

    apiResult.data = await UserService.getDetailed(
      {
        ...reqData.params,
        ...reqData.query,
      },
      req.sessionAuth as (ISessionAuth | undefined)
    );

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<IUserGetDetailedResultService[]>();

    const reqData = req as IUserGetManySchema;

    apiResult.data = await UserService.getManyDetailed(
      {
        ...reqData.query,
      },
      req.sessionAuth as (ISessionAuth | undefined)
    );

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const getWithURL = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<IUserGetDetailedResultService>();

    const reqData = req as IUserGetWithURLSchema;

    apiResult.data = await UserService.getDetailed(
      {
        ...reqData.params,
        ...reqData.query,
      },
      req.sessionAuth as (ISessionAuth | undefined)
    );

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const add = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<IUserModel>();

    const reqData = req as IUserPostSchema;

    apiResult.data = await UserService.add({
      ...reqData.body,
      ...(reqData.body.banDateEnd
        ? { banDateEnd: new Date(reqData.body.banDateEnd) }
        : { banDateEnd: undefined }),
      authorId: req.sessionAuth!.user!.userId.toString(),
      lastAuthorId: req.sessionAuth!.user!.userId.toString(),
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updateWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IUserPutWithIdSchema;

    await UserService.update({
      ...reqData.params,
      ...reqData.body,
      ...(reqData.body.banDateEnd
        ? { banDateEnd: new Date(reqData.body.banDateEnd) }
        : { banDateEnd: undefined }),
      lastAuthorId: req.sessionAuth!.user!.userId.toString(),
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updateProfile = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IUserPutProfileSchema;

    let user = await UserService.update({
      ...reqData.body,
      _id: req.sessionAuth!.user!.userId.toString(),
    });

    if(user){
      req.sessionAuth!.set('user', {
        ...req.sessionAuth!.user!,
        name: user.name,
        url: user.url ?? "",
        updatedAt: new Date(),
      });
    }else{
      apiResult.status = false;
      apiResult.setErrorCode = ApiErrorCodes.notFound;
      apiResult.setStatusCode = ApiStatusCodes.notFound;
    }

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updateProfileImage = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IUserPutProfileImageSchema;

    await UserService.update({
      ...reqData.body,
      _id: req.sessionAuth!.user!.userId.toString(),
    });

    req.sessionAuth!.set('user', {
      ...req.sessionAuth!.user!,
      image: reqData.body.image,
      updatedAt: new Date(),
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updatePassword = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IUserPutPasswordSchema;

    const serviceResult = await UserService.update({
      _id: req.sessionAuth!.user!.userId.toString(),
      password: reqData.body.newPassword,
    });

    if (serviceResult) {
      const token = SessionAuthUtil.createToken(
        serviceResult._id.toString(),
        serviceResult.username,
        serviceResult.password,
        req.ip
      );
      req.sessionAuth!.set('_id', token);
      req.sessionAuth!.set('user', {
        ...req.sessionAuth!.user!,
        updatedAt: new Date(),
      });
    }

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const deleteWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IUserDeleteWithIdSchema;

    await UserService.delete({
      ...reqData.params,
      lastAuthorId: req.sessionAuth!.user!.userId.toString(),
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

export const UserController = {
  getWithId: getWithId,
  getMany: getMany,
  getWithURL: getWithURL,
  add: add,
  updateWithId: updateWithId,
  updateProfile: updateProfile,
  updateProfileImage: updateProfileImage,
  updatePassword: updatePassword,
  deleteWithId: deleteWithId,
};
