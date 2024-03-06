import { FastifyInstance } from 'fastify';
import {PostTermSchema} from "../../schemas/postTerm.schema";
import {PostTermMiddleware} from "../../middlewares/postTerm.middleware";
import {PostTermController} from "../../controllers/postTerm.controller";
import {RequestMiddleware} from "../../middlewares/validates/request.middleware";
import {SessionAuthMiddleware} from "../../middlewares/validates/sessionAuth.middleware";
import {PermissionMiddleware} from "../../middlewares/validates/permission.middleware";
import {PermissionUtil} from '../../utils/permission.util';
import {PostTermEndPoint} from "../../constants/endPoints/postTerm.endPoint";

export const postTermRoute = function (fastify: FastifyInstance, opts: any, done: () => void) {
    const postTermEndPoint = new PostTermEndPoint("");
    fastify.get(postTermEndPoint.GET, { preHandler: [RequestMiddleware.check(PostTermSchema.getMany)] }, PostTermController.getMany);
    fastify.get(postTermEndPoint.GET_WITH_URL, { preHandler: [RequestMiddleware.check(PostTermSchema.getWithURL)] }, PostTermController.getWithURL);
    fastify.get(postTermEndPoint.GET_WITH_ID, { preHandler: [RequestMiddleware.check(PostTermSchema.getWithId), SessionAuthMiddleware.check] }, PostTermController.getWithId);
    fastify.post(postTermEndPoint.ADD, { preHandler: [RequestMiddleware.check(PostTermSchema.post), SessionAuthMiddleware.check, PermissionMiddleware.check(PermissionUtil.getPostPermission)] }, PostTermController.add);
    fastify.put(postTermEndPoint.UPDATE_RANK_WITH_ID, { preHandler: [RequestMiddleware.check(PostTermSchema.putRankWithId), SessionAuthMiddleware.check, PermissionMiddleware.check(PermissionUtil.getPostPermission), PostTermMiddleware.checkWithId, PostTermMiddleware.checkIsAuthorWithId] }, PostTermController.updateRankWithId);
    fastify.put(postTermEndPoint.UPDATE_STATUS, { preHandler: [RequestMiddleware.check(PostTermSchema.putStatusMany), SessionAuthMiddleware.check, PermissionMiddleware.check(PermissionUtil.getPostPermission), PostTermMiddleware.checkMany, PostTermMiddleware.checkIsAuthorMany] }, PostTermController.updateStatusMany);
    fastify.put(postTermEndPoint.UPDATE_WITH_ID, { preHandler: [RequestMiddleware.check(PostTermSchema.putWithId), SessionAuthMiddleware.check, PermissionMiddleware.check(PermissionUtil.getPostPermission), PostTermMiddleware.checkWithId, PostTermMiddleware.checkIsAuthorWithId] }, PostTermController.updateWithId);
    fastify.delete(postTermEndPoint.DELETE, { preHandler: [RequestMiddleware.check(PostTermSchema.deleteMany), SessionAuthMiddleware.check, PermissionMiddleware.check(PermissionUtil.getPostPermission), PostTermMiddleware.checkMany, PostTermMiddleware.checkIsAuthorMany] }, PostTermController.deleteMany);
    done();
}