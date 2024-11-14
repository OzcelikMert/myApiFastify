import { FastifyInstance } from 'fastify';
import { PostSchema } from '@schemas/post.schema';
import { PostController } from '@controllers/post.controller';
import { PostMiddleware } from '@middlewares/post.middleware';
import { ViewMiddleware } from '@middlewares/view.middleware';
import { RequestMiddleware } from '@middlewares/validates/request.middleware';
import { SessionAuthMiddleware } from '@middlewares/validates/sessionAuth.middleware';
import { PermissionMiddleware } from '@middlewares/validates/permission.middleware';
import { PermissionUtil } from '@utils/permission.util';
import { PostEndPoint } from '@constants/endPoints/post.endPoint';
import { PostEndPointPermission } from '@constants/endPointPermissions/post.endPoint.permission';

export const postRoute = function (
  fastify: FastifyInstance,
  opts: any,
  done: () => void
) {
  const endPoint = new PostEndPoint('');
  fastify.get(
    endPoint.GET,
    { preHandler: [RequestMiddleware.check(PostSchema.getMany)] },
    PostController.getMany
  );
  fastify.get(
    endPoint.GET_COUNT,
    { preHandler: [RequestMiddleware.check(PostSchema.getCount)] },
    PostController.getCount
  );
  fastify.get(
    endPoint.GET_WITH_URL,
    { preHandler: [RequestMiddleware.check(PostSchema.getWithURL)] },
    PostController.getWithURL
  );
  fastify.get(
    endPoint.GET_PREV_NEXT_WITH_ID,
    { preHandler: [RequestMiddleware.check(PostSchema.getPrevNextWithId)] },
    PostController.getPrevNextWithId
  );
  fastify.get(
    endPoint.GET_WITH_ID,
    {
      preHandler: [
        RequestMiddleware.check(PostSchema.getWithId),
        SessionAuthMiddleware.check,
      ],
    },
    PostController.getWithId
  );
  fastify.post(
    endPoint.ADD,
    {
      preHandler: [
        RequestMiddleware.check(PostSchema.post),
        SessionAuthMiddleware.check,
        PermissionMiddleware.check(PermissionUtil.getPostPermission()),
      ],
    },
    PostController.add
  );
  fastify.post(
    endPoint.ADD_PRODUCT,
    {
      preHandler: [
        RequestMiddleware.check(PostSchema.postProduct),
        SessionAuthMiddleware.check,
        PermissionMiddleware.check(PostEndPointPermission.ADD_PRODUCT),
      ],
    },
    PostController.addProduct
  );
  fastify.put(
    endPoint.UPDATE_VIEW_WITH_ID,
    {
      preHandler: [
        RequestMiddleware.check(PostSchema.putViewWithId),
        PostMiddleware.checkWithId,
        ViewMiddleware.check,
      ],
    },
    PostController.updateViewWithId
  );
  fastify.put(
    endPoint.UPDATE_RANK_WITH_ID,
    {
      preHandler: [
        RequestMiddleware.check(PostSchema.putRankWithId),
        SessionAuthMiddleware.check,
        PermissionMiddleware.check(PermissionUtil.getPostPermission()),
        PostMiddleware.checkUserRoleForPage,
        PostMiddleware.checkWithId,
        PostMiddleware.checkIsAuthorWithId,
      ],
    },
    PostController.updateRankWithId
  );
  fastify.put(
    endPoint.UPDATE_STATUS,
    {
      preHandler: [
        RequestMiddleware.check(PostSchema.putStatusMany),
        SessionAuthMiddleware.check,
        PermissionMiddleware.check(PermissionUtil.getPostPermission()),
        PostMiddleware.checkUserRoleForPage,
        PostMiddleware.checkMany,
        PostMiddleware.checkIsAuthorMany,
      ],
    },
    PostController.updateStatusMany
  );
  fastify.put(
    endPoint.UPDATE_PRODUCT_WITH_ID,
    {
      preHandler: [
        RequestMiddleware.check(PostSchema.putProductWithId),
        SessionAuthMiddleware.check,
        PermissionMiddleware.check(PostEndPointPermission.UPDATE_PRODUCT),
        PostMiddleware.checkWithId,
        PostMiddleware.checkIsAuthorWithId,
        PostMiddleware.checkPermissionWithId,
      ],
    },
    PostController.updateProductWithId
  );
  fastify.put(
    endPoint.UPDATE_WITH_ID,
    {
      preHandler: [
        RequestMiddleware.check(PostSchema.putWithId),
        SessionAuthMiddleware.check,
        PermissionMiddleware.check(PermissionUtil.getPostPermission()),
        PostMiddleware.checkWithId,
        PostMiddleware.checkPermissionForPageWithId,
        PostMiddleware.checkIsAuthorWithId,
        PostMiddleware.checkPermissionWithId,
      ],
    },
    PostController.updateWithId
  );
  fastify.delete(
    endPoint.DELETE,
    {
      preHandler: [
        RequestMiddleware.check(PostSchema.deleteMany),
        SessionAuthMiddleware.check,
        PermissionMiddleware.check(PermissionUtil.getPostPermission()),
        PostMiddleware.checkMany,
        PostMiddleware.checkIsAuthorMany,
      ],
    },
    PostController.deleteMany
  );
  fastify.delete(
    endPoint.DELETE_PRODUCT,
    {
      preHandler: [
        RequestMiddleware.check(PostSchema.deleteProductMany),
        SessionAuthMiddleware.check,
        PermissionMiddleware.check(PostEndPointPermission.DELETE_PRODUCT),
        PostMiddleware.checkMany,
        PostMiddleware.checkIsAuthorMany,
      ],
    },
    PostController.deleteProductMany
  );
  done();
};
