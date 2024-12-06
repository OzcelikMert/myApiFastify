import { FastifyInstance } from 'fastify';
import { PostTermSchema } from '@schemas/postTerm.schema';
import { PostTermMiddleware } from '@middlewares/postTerm.middleware';
import { PostTermController } from '@controllers/postTerm.controller';
import { RequestMiddleware } from '@middlewares/validates/request.middleware';
import { SessionAuthMiddleware } from '@middlewares/validates/sessionAuth.middleware';
import { PermissionMiddleware } from '@middlewares/validates/permission.middleware';
import { PermissionUtil } from '@utils/permission.util';
import { PostTermEndPoint } from '@constants/endPoints/postTerm.endPoint';
import { ViewMiddleware } from '@middlewares/view.middleware';

export const postTermRoute = function (
  fastify: FastifyInstance,
  opts: {},
  done: () => void
) {
  const endPoint = new PostTermEndPoint('');
  fastify.get(
    endPoint.GET,
    { preHandler: [RequestMiddleware.check(PostTermSchema.getMany)] },
    PostTermController.getMany
  );
  fastify.get(
    endPoint.GET_WITH_URL,
    { preHandler: [RequestMiddleware.check(PostTermSchema.getWithURL)] },
    PostTermController.getWithURL
  );
  fastify.get(
    endPoint.GET_WITH_ID,
    {
      preHandler: [
        RequestMiddleware.check(PostTermSchema.getWithId),
        SessionAuthMiddleware.check,
      ],
    },
    PostTermController.getWithId
  );
  fastify.post(
    endPoint.ADD,
    {
      preHandler: [
        RequestMiddleware.check(PostTermSchema.post),
        SessionAuthMiddleware.check,
        PermissionMiddleware.check(PermissionUtil.getPostPermission('PUT')),
      ],
    },
    PostTermController.add
  );
  fastify.put(
    endPoint.UPDATE_RANK_WITH_ID,
    {
      preHandler: [
        RequestMiddleware.check(PostTermSchema.putRankWithId),
        SessionAuthMiddleware.check,
        PermissionMiddleware.check(PermissionUtil.getPostPermission()),
        PostTermMiddleware.checkWithId,
        PostTermMiddleware.checkIsAuthorWithId,
      ],
    },
    PostTermController.updateRankWithId
  );
  fastify.put(
    endPoint.UPDATE_VIEW_WITH_ID,
    {
      preHandler: [
        RequestMiddleware.check(PostTermSchema.putViewWithId),
        PostTermMiddleware.checkWithId,
        ViewMiddleware.check,
      ],
    },
    PostTermController.updateViewWithId
  );
  fastify.put(
    endPoint.UPDATE_STATUS,
    {
      preHandler: [
        RequestMiddleware.check(PostTermSchema.putStatusMany),
        SessionAuthMiddleware.check,
        PermissionMiddleware.check(PermissionUtil.getPostPermission()),
        PostTermMiddleware.checkMany,
        PostTermMiddleware.checkIsAuthorMany,
      ],
    },
    PostTermController.updateStatusMany
  );
  fastify.put(
    endPoint.UPDATE_WITH_ID,
    {
      preHandler: [
        RequestMiddleware.check(PostTermSchema.putWithId),
        SessionAuthMiddleware.check,
        PermissionMiddleware.check(PermissionUtil.getPostPermission()),
        PostTermMiddleware.checkWithId,
        PostTermMiddleware.checkIsAuthorWithId,
      ],
    },
    PostTermController.updateWithId
  );
  fastify.delete(
    endPoint.DELETE,
    {
      preHandler: [
        RequestMiddleware.check(PostTermSchema.deleteMany),
        SessionAuthMiddleware.check,
        PermissionMiddleware.check(PermissionUtil.getPostPermission('PUT')),
        PostTermMiddleware.checkMany,
        PostTermMiddleware.checkIsAuthorMany,
      ],
    },
    PostTermController.deleteMany
  );
  done();
};
