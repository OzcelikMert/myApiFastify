import { FastifyInstance } from 'fastify';
import postTermSchema from "../../schemas/postTerm.schema";
import postTermMiddleware from "../../middlewares/postTerm.middleware";
import postTermController from "../../controllers/postTerm.controller";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";
import permissionUtil from '../../utils/permission.util';
import postTermEndPoint from "../../constants/endPoints/postTerm.endPoint";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(postTermEndPoint.GET, { preHandler: [requestMiddleware.check(postTermSchema.getMany)] }, postTermController.getMany);
    fastify.get(postTermEndPoint.GET_WITH_ID, { preHandler: [requestMiddleware.check(postTermSchema.getOne)] }, postTermController.getOne);
    fastify.post(postTermEndPoint.ADD, { preHandler: [requestMiddleware.check(postTermSchema.post), sessionMiddleware.check, permissionMiddleware.check(permissionUtil.getPostPermission)] }, postTermController.add);
    fastify.put(postTermEndPoint.UPDATE_RANK_WITH_ID, { preHandler: [requestMiddleware.check(postTermSchema.putOneRank), sessionMiddleware.check, permissionMiddleware.check(permissionUtil.getPostPermission), postTermMiddleware.checkOne, postTermMiddleware.checkOneIsAuthor] }, postTermController.updateOneRank);
    fastify.put(postTermEndPoint.UPDATE_STATUS, { preHandler: [requestMiddleware.check(postTermSchema.putManyStatus), sessionMiddleware.check, permissionMiddleware.check(permissionUtil.getPostPermission), postTermMiddleware.checkMany, postTermMiddleware.checkManyIsAuthor] }, postTermController.updateManyStatus);
    fastify.put(postTermEndPoint.UPDATE_WITH_ID, { preHandler: [requestMiddleware.check(postTermSchema.putOne), sessionMiddleware.check, permissionMiddleware.check(permissionUtil.getPostPermission), postTermMiddleware.checkOne, postTermMiddleware.checkOneIsAuthor] }, postTermController.updateOne);
    fastify.delete(postTermEndPoint.DELETE, { preHandler: [requestMiddleware.check(postTermSchema.deleteMany), sessionMiddleware.check, permissionMiddleware.check(permissionUtil.getPostPermission), postTermMiddleware.checkMany, postTermMiddleware.checkManyIsAuthor] }, postTermController.deleteMany);
    done();
}