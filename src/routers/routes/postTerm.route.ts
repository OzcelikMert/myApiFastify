import { FastifyInstance } from 'fastify';
import postTermSchema from "../../schemas/postTerm.schema";
import postTermMiddleware from "../../middlewares/postTerm.middleware";
import postTermController from "../../controllers/postTerm.controller";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get('/get/:_id', { preHandler: [requestMiddleware.check(postTermSchema.get)] }, postTermController.getOne);
    fastify.get('/get', { preHandler: [requestMiddleware.check(postTermSchema.getMany)] }, postTermController.getMany);
    fastify.post('/add', { preHandler: [requestMiddleware.check(postTermSchema.post), sessionMiddleware.check, permissionMiddleware.check, postTermMiddleware.checkUrl] }, postTermController.add);
    fastify.put('/update/rank/:_id', { preHandler: [requestMiddleware.check(postTermSchema.putRank), sessionMiddleware.check, permissionMiddleware.check, postTermMiddleware.checkOne] }, postTermController.updateOneRank);
    fastify.put('/update/status', { preHandler: [requestMiddleware.check(postTermSchema.putManyStatus), sessionMiddleware.check, permissionMiddleware.check, postTermMiddleware.checkMany] }, postTermController.updateManyStatus);
    fastify.put('/update/:_id', { preHandler: [requestMiddleware.check(postTermSchema.put), sessionMiddleware.check, permissionMiddleware.check, postTermMiddleware.checkOne, postTermMiddleware.checkUrl] }, postTermController.updateOne);
    fastify.delete('/delete', { preHandler: [requestMiddleware.check(postTermSchema.deleteMany), sessionMiddleware.check, permissionMiddleware.check, postTermMiddleware.checkMany] }, postTermController.deleteMany);
    done();
}