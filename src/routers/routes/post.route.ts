import { FastifyInstance } from 'fastify';
import postSchema from "../../schemas/post.schema";
import postController from "../../controllers/post.controller";
import postMiddleware from "../../middlewares/post.middleware";
import viewMiddleware from "../../middlewares/view.middleware";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";
import permissionUtil from "../../utils/permission.util";
import postEndPoint from "../../constants/endPoints/post.endPoint";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(postEndPoint.GET, { preHandler: [requestMiddleware.check(postSchema.getMany)] }, postController.getMany);
    fastify.get(postEndPoint.GET_COUNT, { preHandler: [requestMiddleware.check(postSchema.getCount)] }, postController.getCount);
    fastify.get(postEndPoint.GET_WITH_ID, { preHandler: [requestMiddleware.check(postSchema.getOne)] }, postController.getOne);
    fastify.post(postEndPoint.ADD, { preHandler: [requestMiddleware.check(postSchema.post), sessionMiddleware.check, permissionMiddleware.check(permissionUtil.getPostPermission)] }, postController.add);
    fastify.put(postEndPoint.UPDATE_VIEW_WITH_ID, { preHandler: [requestMiddleware.check(postSchema.putOneView), viewMiddleware.check, postMiddleware.checkOne] }, postController.updateOneView);
    fastify.put(postEndPoint.UPDATE_RANK_WITH_ID, { preHandler: [requestMiddleware.check(postSchema.putOneRank), sessionMiddleware.check, permissionMiddleware.check(permissionUtil.getPostPermission), postMiddleware.checkOne] }, postController.updateOneRank);
    fastify.put(postEndPoint.UPDATE_STATUS, { preHandler: [requestMiddleware.check(postSchema.putManyStatus), sessionMiddleware.check, permissionMiddleware.check(permissionUtil.getPostPermission), postMiddleware.checkMany] }, postController.updateManyStatus);
    fastify.put(postEndPoint.UPDATE_WITH_ID, { preHandler: [requestMiddleware.check(postSchema.putOne), sessionMiddleware.check, permissionMiddleware.check(permissionUtil.getPostPermission), postMiddleware.checkOne] }, postController.updateOne);
    fastify.delete(postEndPoint.DELETE, { preHandler: [requestMiddleware.check(postSchema.deleteMany), sessionMiddleware.check, permissionMiddleware.check(permissionUtil.getPostPermission), postMiddleware.checkMany] }, postController.deleteMany);
    done();
}