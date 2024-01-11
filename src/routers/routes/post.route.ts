import { FastifyInstance } from 'fastify';
import postSchema from "../../schemas/post.schema";
import postController from "../../controllers/post.controller";
import postMiddleware from "../../middlewares/post.middleware";
import viewMiddleware from "../../middlewares/view.middleware";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";
import permissionUtil from "../../utils/permission.util";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(PostEndPoint.GET, { preHandler: [requestMiddleware.check(postSchema.getMany)] }, postController.getMany);
    fastify.get(PostEndPoint.GET_COUNT, { preHandler: [requestMiddleware.check(postSchema.getCount)] }, postController.getCount);
    fastify.get(PostEndPoint.GET_WITH_ID, { preHandler: [requestMiddleware.check(postSchema.get)] }, postController.getOne);
    fastify.post(PostEndPoint.ADD, { preHandler: [requestMiddleware.check(postSchema.post), sessionMiddleware.check, permissionMiddleware.check(permissionUtil.getPostPermission)] }, postController.add);
    fastify.put(PostEndPoint.UPDATE_VIEW_WITH_ID, { preHandler: [requestMiddleware.check(postSchema.putView), viewMiddleware.check, postMiddleware.check] }, postController.updateOneView);
    fastify.put(PostEndPoint.UPDATE_RANK_WITH_ID, { preHandler: [requestMiddleware.check(postSchema.putRank), sessionMiddleware.check, permissionMiddleware.check(permissionUtil.getPostPermission), postMiddleware.check] }, postController.updateOneRank);
    fastify.put(PostEndPoint.UPDATE_STATUS, { preHandler: [requestMiddleware.check(postSchema.putManyStatus), sessionMiddleware.check, permissionMiddleware.check(permissionUtil.getPostPermission), postMiddleware.checkMany] }, postController.updateManyStatus);
    fastify.put(PostEndPoint.UPDATE_WITH_ID, { preHandler: [requestMiddleware.check(postSchema.put), sessionMiddleware.check, permissionMiddleware.check(permissionUtil.getPostPermission), postMiddleware.check] }, postController.updateOne);
    fastify.delete(PostEndPoint.DELETE, { preHandler: [requestMiddleware.check(postSchema.deleteMany), sessionMiddleware.check, permissionMiddleware.check(permissionUtil.getPostPermission), postMiddleware.checkMany] }, postController.deleteMany);
    done();
}