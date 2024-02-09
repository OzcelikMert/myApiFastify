import { FastifyInstance } from 'fastify';
import postTermSchema from "../../schemas/postTerm.schema";
import postTermMiddleware from "../../middlewares/postTerm.middleware";
import {PostTermController} from "../../controllers/postTerm.controller";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";
import permissionUtil from '../../utils/permission.util';
import {PostTermEndPoint} from "../../constants/endPoints/postTerm.endPoint";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(PostTermEndPoint.GET, { preHandler: [requestMiddleware.check(postTermSchema.getMany)] }, PostTermController.getMany);
    fastify.get(PostTermEndPoint.GET_WITH_URL, { preHandler: [requestMiddleware.check(postTermSchema.getOneWithURL)] }, PostTermController.getOneWithURL);
    fastify.get(PostTermEndPoint.GET_WITH_ID, { preHandler: [requestMiddleware.check(postTermSchema.getOne), sessionMiddleware.check] }, PostTermController.getOne);
    fastify.post(PostTermEndPoint.ADD, { preHandler: [requestMiddleware.check(postTermSchema.post), sessionMiddleware.check, permissionMiddleware.check(permissionUtil.getPostPermission)] }, PostTermController.add);
    fastify.put(PostTermEndPoint.UPDATE_RANK_WITH_ID, { preHandler: [requestMiddleware.check(postTermSchema.putOneRank), sessionMiddleware.check, permissionMiddleware.check(permissionUtil.getPostPermission), postTermMiddleware.checkOne, postTermMiddleware.checkOneIsAuthor] }, PostTermController.updateOneRank);
    fastify.put(PostTermEndPoint.UPDATE_STATUS, { preHandler: [requestMiddleware.check(postTermSchema.putManyStatus), sessionMiddleware.check, permissionMiddleware.check(permissionUtil.getPostPermission), postTermMiddleware.checkMany, postTermMiddleware.checkManyIsAuthor] }, PostTermController.updateManyStatus);
    fastify.put(PostTermEndPoint.UPDATE_WITH_ID, { preHandler: [requestMiddleware.check(postTermSchema.putOne), sessionMiddleware.check, permissionMiddleware.check(permissionUtil.getPostPermission), postTermMiddleware.checkOne, postTermMiddleware.checkOneIsAuthor] }, PostTermController.updateOne);
    fastify.delete(PostTermEndPoint.DELETE, { preHandler: [requestMiddleware.check(postTermSchema.deleteMany), sessionMiddleware.check, permissionMiddleware.check(permissionUtil.getPostPermission), postTermMiddleware.checkMany, postTermMiddleware.checkManyIsAuthor] }, PostTermController.deleteMany);
    done();
}