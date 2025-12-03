import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiResult } from '@library/api/result';
import { LogMiddleware } from '@middlewares/log.middleware';
import { IPostCommentGetDetailedResultService } from 'types/services/db/postComment.service';
import {
  IPostCommentDeleteManySchema,
  IPostCommentGetManySchema,
  IPostCommentGetWithIdSchema,
  IPostCommentPostSchema,
  IPostCommentPutLikeWithIdSchema,
  IPostCommentPutStatusManySchema,
  IPostCommentPutWithIdSchema,
} from '@schemas/postComment.schema';
import { PostCommentService } from '@services/db/postComment.service';
import { IPostCommentModel } from 'types/models/postComment.model';

const getWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<IPostCommentGetDetailedResultService>();

    const reqData = req as IPostCommentGetWithIdSchema;

    apiResult.data = await PostCommentService.getDetailed({
      ...reqData.params,
      ...reqData.query,
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<IPostCommentGetDetailedResultService[]>();

    const reqData = req as IPostCommentGetManySchema;

    apiResult.data = await PostCommentService.getManyDetailed({
      ...reqData.query,
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const add = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<IPostCommentModel>();

    const reqData = req as IPostCommentPostSchema;

    apiResult.data = await PostCommentService.add({
      ...reqData.body,
      lastAuthorId: req.sessionAuth!.user!.userId.toString(),
      authorId: req.sessionAuth!.user!.userId.toString(),
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updateWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IPostCommentPutWithIdSchema;

    await PostCommentService.update({
      ...reqData.body,
      ...reqData.params,
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updateLikeWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<number>();

    const reqData = req as IPostCommentPutLikeWithIdSchema;

    apiResult.data = await PostCommentService.updateLike({
      ...reqData.body,
      ...reqData.params,
      authorId: req.sessionAuth!.user!.userId.toString(),
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updateStatusMany = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IPostCommentPutStatusManySchema;

    await PostCommentService.updateStatusMany({
      ...reqData.body,
      lastAuthorId: req.sessionAuth!.user!.userId.toString(),
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const deleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IPostCommentDeleteManySchema;

    await PostCommentService.deleteMany({
      ...reqData.body,
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

export const PostCommentController = {
  getWithId: getWithId,
  getMany: getMany,
  add: add,
  updateWithId: updateWithId,
  updateLikeWithId: updateLikeWithId,
  updateStatusMany: updateStatusMany,
  deleteMany: deleteMany,
};
