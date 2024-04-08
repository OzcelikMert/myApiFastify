import {FastifyInstance} from 'fastify';
import {PostSchema} from "@schemas/post.schema";
import {PostController} from "@controllers/post.controller";
import {PostMiddleware} from "@middlewares/post.middleware";
import {ViewMiddleware} from "@middlewares/view.middleware";
import {RequestMiddleware} from "@middlewares/validates/request.middleware";
import {SessionAuthMiddleware} from "@middlewares/validates/sessionAuth.middleware";
import {PermissionMiddleware} from "@middlewares/validates/permission.middleware";
import {PermissionUtil} from "@utils/permission.util";
import {PostEndPoint} from "@constants/endPoints/post.endPoint";

export const postRoute = function (fastify: FastifyInstance, opts: any, done: () => void) {
    const postEndPoint = new PostEndPoint("");
    fastify.get(postEndPoint.GET, { preHandler: [RequestMiddleware.check(PostSchema.getMany)] }, PostController.getMany);
    fastify.get(postEndPoint.GET_COUNT, { preHandler: [RequestMiddleware.check(PostSchema.getCount)] }, PostController.getCount);
    fastify.get(postEndPoint.GET_WITH_URL, { preHandler: [RequestMiddleware.check(PostSchema.getWithURL)] }, PostController.getWithURL);
    fastify.get(postEndPoint.GET_WITH_ID, { preHandler: [RequestMiddleware.check(PostSchema.getWithId), SessionAuthMiddleware.check] }, PostController.getWithId);
    fastify.post(postEndPoint.ADD, { preHandler: [RequestMiddleware.check(PostSchema.post), SessionAuthMiddleware.check, PermissionMiddleware.check(PermissionUtil.getPostPermission), PostMiddleware.checkPageTypeId] }, PostController.add);
    fastify.put(postEndPoint.UPDATE_VIEW_WITH_ID, { preHandler: [RequestMiddleware.check(PostSchema.putViewWithId), ViewMiddleware.check, PostMiddleware.checkWithId] }, PostController.updateViewWithId);
    fastify.put(postEndPoint.UPDATE_RANK_WITH_ID, { preHandler: [RequestMiddleware.check(PostSchema.putRankWithId), SessionAuthMiddleware.check, PermissionMiddleware.check(PermissionUtil.getPostPermission), PostMiddleware.checkWithId, PostMiddleware.checkIsAuthorWithId] }, PostController.updateRankWithId);
    fastify.put(postEndPoint.UPDATE_STATUS, { preHandler: [RequestMiddleware.check(PostSchema.putStatusMany), SessionAuthMiddleware.check, PermissionMiddleware.check(PermissionUtil.getPostPermission), PostMiddleware.checkMany, PostMiddleware.checkIsAuthorMany] }, PostController.updateStatusMany);
    fastify.put(postEndPoint.UPDATE_WITH_ID, { preHandler: [RequestMiddleware.check(PostSchema.putWithId), SessionAuthMiddleware.check, PermissionMiddleware.check(PermissionUtil.getPostPermission), PostMiddleware.checkWithId, PostMiddleware.checkPageTypeId, PostMiddleware.checkIsAuthorWithId, PostMiddleware.checkAuthorsWithId] }, PostController.updateWithId);
    fastify.delete(postEndPoint.DELETE, { preHandler: [RequestMiddleware.check(PostSchema.deleteMany), SessionAuthMiddleware.check, PermissionMiddleware.check(PermissionUtil.getPostPermission), PostMiddleware.checkMany, PostMiddleware.checkIsAuthorMany] }, PostController.deleteMany);
    done();
}