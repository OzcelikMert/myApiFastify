import { FastifyInstance } from 'fastify';
import {PostSchema} from "../../schemas/post.schema";
import {PostController} from "../../controllers/post.controller";
import {PostMiddleware} from "../../middlewares/post.middleware";
import {ViewMiddleware} from "../../middlewares/view.middleware";
import {RequestMiddleware} from "../../middlewares/validates/request.middleware";
import {SessionAuthMiddleware} from "../../middlewares/validates/sessionAuth.middleware";
import {PermissionMiddleware} from "../../middlewares/validates/permission.middleware";
import {PermissionUtil} from "../../utils/permission.util";
import {PostEndPoint} from "../../constants/endPoints/post.endPoint";

export const postRoute = function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(PostEndPoint.GET, { preHandler: [RequestMiddleware.check(PostSchema.getMany)] }, PostController.getMany);
    fastify.get(PostEndPoint.GET_COUNT, { preHandler: [RequestMiddleware.check(PostSchema.getCount)] }, PostController.getCount);
    fastify.get(PostEndPoint.GET_WITH_URL, { preHandler: [RequestMiddleware.check(PostSchema.getOneWithURL)] }, PostController.getOneWithURL);
    fastify.get(PostEndPoint.GET_WITH_ID, { preHandler: [RequestMiddleware.check(PostSchema.getOne), SessionAuthMiddleware.check] }, PostController.getOne);
    fastify.post(PostEndPoint.ADD, { preHandler: [RequestMiddleware.check(PostSchema.post), SessionAuthMiddleware.check, PermissionMiddleware.check(PermissionUtil.getPostPermission)] }, PostController.add);
    fastify.put(PostEndPoint.UPDATE_VIEW_WITH_ID, { preHandler: [RequestMiddleware.check(PostSchema.putOneView), ViewMiddleware.check, PostMiddleware.checkOne] }, PostController.updateOneView);
    fastify.put(PostEndPoint.UPDATE_RANK_WITH_ID, { preHandler: [RequestMiddleware.check(PostSchema.putOneRank), SessionAuthMiddleware.check, PermissionMiddleware.check(PermissionUtil.getPostPermission), PostMiddleware.checkOne, PostMiddleware.checkOneIsAuthor] }, PostController.updateOneRank);
    fastify.put(PostEndPoint.UPDATE_STATUS, { preHandler: [RequestMiddleware.check(PostSchema.putManyStatus), SessionAuthMiddleware.check, PermissionMiddleware.check(PermissionUtil.getPostPermission), PostMiddleware.checkMany, PostMiddleware.checkManyIsAuthor] }, PostController.updateManyStatus);
    fastify.put(PostEndPoint.UPDATE_WITH_ID, { preHandler: [RequestMiddleware.check(PostSchema.putOne), SessionAuthMiddleware.check, PermissionMiddleware.check(PermissionUtil.getPostPermission), PostMiddleware.checkOne, PostMiddleware.checkOneIsAuthor] }, PostController.updateOne);
    fastify.delete(PostEndPoint.DELETE, { preHandler: [RequestMiddleware.check(PostSchema.deleteMany), SessionAuthMiddleware.check, PermissionMiddleware.check(PermissionUtil.getPostPermission), PostMiddleware.checkMany, PostMiddleware.checkManyIsAuthor] }, PostController.deleteMany);
    done();
}