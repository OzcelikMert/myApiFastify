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
    fastify.get(postTermEndPoint.GET_WITH_URL, { preHandler: [RequestMiddleware.check(PostTermSchema.getOneWithURL)] }, PostTermController.getOneWithURL);
    fastify.get(postTermEndPoint.GET_WITH_ID, { preHandler: [RequestMiddleware.check(PostTermSchema.getOne), SessionAuthMiddleware.check] }, PostTermController.getOne);
    fastify.post(postTermEndPoint.ADD, { preHandler: [RequestMiddleware.check(PostTermSchema.post), SessionAuthMiddleware.check, PermissionMiddleware.check(PermissionUtil.getPostPermission)] }, PostTermController.add);
    fastify.put(postTermEndPoint.UPDATE_RANK_WITH_ID, { preHandler: [RequestMiddleware.check(PostTermSchema.putOneRank), SessionAuthMiddleware.check, PermissionMiddleware.check(PermissionUtil.getPostPermission), PostTermMiddleware.checkOne, PostTermMiddleware.checkOneIsAuthor] }, PostTermController.updateOneRank);
    fastify.put(postTermEndPoint.UPDATE_STATUS, { preHandler: [RequestMiddleware.check(PostTermSchema.putManyStatus), SessionAuthMiddleware.check, PermissionMiddleware.check(PermissionUtil.getPostPermission), PostTermMiddleware.checkMany, PostTermMiddleware.checkManyIsAuthor] }, PostTermController.updateManyStatus);
    fastify.put(postTermEndPoint.UPDATE_WITH_ID, { preHandler: [RequestMiddleware.check(PostTermSchema.putOne), SessionAuthMiddleware.check, PermissionMiddleware.check(PermissionUtil.getPostPermission), PostTermMiddleware.checkOne, PostTermMiddleware.checkOneIsAuthor] }, PostTermController.updateOne);
    fastify.delete(postTermEndPoint.DELETE, { preHandler: [RequestMiddleware.check(PostTermSchema.deleteMany), SessionAuthMiddleware.check, PermissionMiddleware.check(PermissionUtil.getPostPermission), PostTermMiddleware.checkMany, PostTermMiddleware.checkManyIsAuthor] }, PostTermController.deleteMany);
    done();
}