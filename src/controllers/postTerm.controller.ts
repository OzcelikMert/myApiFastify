import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiResult } from '@library/api/result';
import {
  IPostTermDeleteManySchema,
  IPostTermGetWithIdSchema,
  IPostTermGetManySchema,
  IPostTermPostSchema,
  IPostTermPutWithIdSchema,
  IPostTermGetWithURLSchema,
  IPostTermPutRankWithIdSchema,
  IPostTermPutStatusManySchema,
  IPostTermPutViewWithIdSchema,
} from '@schemas/postTerm.schema';
import { PostTermService } from '@services/db/postTerm.service';
import { LogMiddleware } from '@middlewares/log.middleware';
import { PermissionUtil } from '@utils/permission.util';
import { UserRoleId } from '@constants/userRoles';
import { IPostTermModel } from 'types/models/postTerm.model';
import { IPostTermGetDetailedResultService } from 'types/services/db/postTerm.service';
import { PostTermCacheService } from '@services/cache/postTerm.cache.service';
import { PostTermCachePolicy } from 'policies/cache/postTerm.cache.policy';

const getWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<IPostTermGetDetailedResultService>();

    const reqData = req as IPostTermGetWithIdSchema;

    apiResult.data = await PostTermService.getDetailed({
      ...reqData.params,
      ...reqData.query,
      ...(!PermissionUtil.checkPermissionRoleRank(
        req.sessionAuth!.user!.roleId,
        UserRoleId.Editor
      )
        ? { authorId: req.sessionAuth!.user!.userId.toString() }
        : {}),
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<IPostTermGetDetailedResultService[]>();

    const reqData = req as IPostTermGetManySchema;
    const isCachable = PostTermCachePolicy.getMany(req);

    if (isCachable) {
      apiResult.data = await PostTermCacheService.get<
        IPostTermGetDetailedResultService[]
      >({ ...reqData.query, typeId: reqData.query.typeId![0] });
    }

    if (apiResult.data == null) {
      apiResult.data = await PostTermService.getManyDetailed({
        ...reqData.query,
        ...(req.isFromAdminPanel &&
        !PermissionUtil.checkPermissionRoleRank(
          req.sessionAuth!.user!.roleId,
          UserRoleId.Editor
        )
          ? { authorId: req.sessionAuth!.user!.userId.toString() }
          : {}),
      });
      if (isCachable && apiResult.data.length > 0) {
        await PostTermCacheService.add(
          { ...reqData.query, typeId: reqData.query.typeId![0] },
          apiResult.data
        );
      }
    }

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const getWithURL = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<IPostTermGetDetailedResultService>();

    const reqData = req as IPostTermGetWithURLSchema;

    apiResult.data = await PostTermService.getDetailed({
      ...reqData.params,
      ...reqData.query,
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const add = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<IPostTermModel>();

    const reqData = req as IPostTermPostSchema;

    apiResult.data = await PostTermService.add({
      ...reqData.body,
      lastAuthorId: req.sessionAuth!.user!.userId.toString(),
      authorId: req.sessionAuth!.user!.userId.toString(),
    });

    await PostTermCacheService.deleteMany(reqData.body);

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updateWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IPostTermPutWithIdSchema;

    await PostTermService.update({
      ...reqData.body,
      ...reqData.params,
      lastAuthorId: req.sessionAuth!.user!.userId.toString(),
    });

    await PostTermCacheService.deleteMany(reqData.body);

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updateRankWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IPostTermPutRankWithIdSchema;

    await PostTermService.updateRank({
      ...reqData.body,
      ...reqData.params,
      lastAuthorId: req.sessionAuth!.user!.userId.toString(),
    });

    await PostTermCacheService.deleteMany(reqData.body);

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updateViewWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IPostTermPutViewWithIdSchema;

    await PostTermService.updateView({
      ...reqData.params,
      ...reqData.body,
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updateStatusMany = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IPostTermPutStatusManySchema;

    await PostTermService.updateStatusMany({
      ...reqData.body,
      lastAuthorId: req.sessionAuth!.user!.userId.toString(),
    });

    await PostTermCacheService.deleteMany(reqData.body);

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const deleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IPostTermDeleteManySchema;

    await PostTermService.deleteMany({
      ...reqData.body,
    });
    
    await PostTermCacheService.deleteMany(reqData.body);

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

export const PostTermController = {
  getWithId: getWithId,
  getMany: getMany,
  getWithURL: getWithURL,
  add: add,
  updateWithId: updateWithId,
  updateRankWithId: updateRankWithId,
  updateViewWithId: updateViewWithId,
  updateStatusMany: updateStatusMany,
  deleteMany: deleteMany,
};
