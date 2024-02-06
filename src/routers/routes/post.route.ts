import { FastifyInstance } from 'fastify';
import postSchema from "../../schemas/post.schema";
import postController from "../../controllers/post.controller";
import postMiddleware from "../../middlewares/post.middleware";
import viewMiddleware from "../../middlewares/view.middleware";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";
import permissionUtil from "../../utils/permission.util";
import {PostEndPoint} from "../../constants/endPoints/post.endPoint";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(PostEndPoint.GET, { preHandler: [requestMiddleware.check(postSchema.getMany)] }, postController.getMany);
    fastify.get(PostEndPoint.GET_COUNT, { preHandler: [requestMiddleware.check(postSchema.getCount)] }, postController.getCount);
    fastify.get(PostEndPoint.GET_WITH_URL, { preHandler: [requestMiddleware.check(postSchema.getOneWithURL)] }, postController.getOneWithURL);
    fastify.get(PostEndPoint.GET_WITH_ID, { preHandler: [requestMiddleware.check(postSchema.getOne), sessionMiddleware.check] }, postController.getOne);
    fastify.post(PostEndPoint.ADD, { preHandler: [requestMiddleware.check(postSchema.post), sessionMiddleware.check, permissionMiddleware.check(permissionUtil.getPostPermission)] }, postController.add);
    fastify.put(PostEndPoint.UPDATE_VIEW_WITH_ID, { preHandler: [requestMiddleware.check(postSchema.putOneView), viewMiddleware.check, postMiddleware.checkOne] }, postController.updateOneView);
    fastify.put(PostEndPoint.UPDATE_RANK_WITH_ID, { preHandler: [requestMiddleware.check(postSchema.putOneRank), sessionMiddleware.check, permissionMiddleware.check(permissionUtil.getPostPermission), postMiddleware.checkOne, postMiddleware.checkOneIsAuthor] }, postController.updateOneRank);
    fastify.put(PostEndPoint.UPDATE_STATUS, { preHandler: [requestMiddleware.check(postSchema.putManyStatus), sessionMiddleware.check, permissionMiddleware.check(permissionUtil.getPostPermission), postMiddleware.checkMany, postMiddleware.checkManyIsAuthor] }, postController.updateManyStatus);
    fastify.put(PostEndPoint.UPDATE_WITH_ID, { preHandler: [requestMiddleware.check(postSchema.putOne), sessionMiddleware.check, permissionMiddleware.check(permissionUtil.getPostPermission), postMiddleware.checkOne, postMiddleware.checkOneIsAuthor] }, postController.updateOne);
    fastify.delete(PostEndPoint.DELETE, { preHandler: [requestMiddleware.check(postSchema.deleteMany), sessionMiddleware.check, permissionMiddleware.check(permissionUtil.getPostPermission), postMiddleware.checkMany, postMiddleware.checkManyIsAuthor] }, postController.deleteMany);
    done();
}