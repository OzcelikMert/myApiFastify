import { FastifyInstance } from 'fastify';
import { RequestMiddleware } from '@middlewares/validates/request.middleware';
import { SessionAuthMiddleware } from '@middlewares/validates/sessionAuth.middleware';
import { PermissionMiddleware } from '@middlewares/validates/permission.middleware';
import { PermissionUtil } from '@utils/permission.util';
import { PostCommentEndPoint } from '@constants/endPoints/postComment.endPoint';
import { PostCommentSchema } from '@schemas/postComment.schema';
import { PostCommentController } from '@controllers/postComment.controller';
import { PostCommentMiddleware } from '@middlewares/postComment.middleware';

export const postCommentRoute = function (
  fastify: FastifyInstance,
  opts: any,
  done: () => void
) {
  const endPoint = new PostCommentEndPoint('');
  fastify.get(
    endPoint.GET,
    { preHandler: [RequestMiddleware.check(PostCommentSchema.getMany)] },
    PostCommentController.getMany
  );
  fastify.get(
    endPoint.GET_WITH_ID,
    {
      preHandler: [
        RequestMiddleware.check(PostCommentSchema.getWithId),
        SessionAuthMiddleware.check,
      ],
    },
    PostCommentController.getWithId
  );
  fastify.post(
    endPoint.ADD,
    {
      preHandler: [
        RequestMiddleware.check(PostCommentSchema.post),
        SessionAuthMiddleware.check,
      ],
    },
    PostCommentController.add
  );
  fastify.put(
    endPoint.UPDATE_STATUS,
    {
      preHandler: [
        RequestMiddleware.check(PostCommentSchema.putStatusMany),
        SessionAuthMiddleware.check,
        PermissionMiddleware.check(PermissionUtil.getPostPermission()),
        PostCommentMiddleware.checkMany,
        PostCommentMiddleware.checkIsAuthorWithIdForPost,
      ],
    },
    PostCommentController.updateStatusMany
  );
  fastify.put(
    endPoint.UPDATE_LIKE_WITH_ID,
    {
      preHandler: [
        RequestMiddleware.check(PostCommentSchema.putLikeWithId),
        SessionAuthMiddleware.check,
        PostCommentMiddleware.checkWithId,
      ],
    },
    PostCommentController.updateLikeWithId
  );
  fastify.delete(
    endPoint.DELETE,
    {
      preHandler: [
        RequestMiddleware.check(PostCommentSchema.deleteMany),
        SessionAuthMiddleware.check,
        PermissionMiddleware.check(PermissionUtil.getPostPermission('PUT')),
        PostCommentMiddleware.checkMany,
        PostCommentMiddleware.checkIsAuthorWithIdForPost,
      ],
    },
    PostCommentController.deleteMany
  );
  done();
};
