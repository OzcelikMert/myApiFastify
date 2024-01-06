import { FastifyInstance } from 'fastify';
import navigationSchema from "../../schemas/navigation.schema";
import navigationController from "../../controllers/navigation.controller";
import navigationMiddleware from "../../middlewares/navigation.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import requestMiddleware from "../../middlewares/validates/request.middleware";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get('/get', { preHandler: [requestMiddleware.check(navigationSchema.getMany)] }, navigationController.getMany);
    fastify.get('/get/:_id', { preHandler: [requestMiddleware.check(navigationSchema.get)] }, navigationController.getOne);
    fastify.post('/add', { preHandler: [requestMiddleware.check(navigationSchema.post), sessionMiddleware.check, permissionMiddleware.check] }, navigationController.add);
    fastify.put('/update/rank/:_id', { preHandler: [requestMiddleware.check(navigationSchema.putRank), sessionMiddleware.check, permissionMiddleware.check, navigationMiddleware.checkOne] }, navigationController.updateOneRank);
    fastify.put('/update/status', { preHandler: [requestMiddleware.check(navigationSchema.putManyStatus), sessionMiddleware.check, permissionMiddleware.check, navigationMiddleware.checkMany] }, navigationController.updateManyStatus);
    fastify.put('/update/:_id', { preHandler: [requestMiddleware.check(navigationSchema.put), sessionMiddleware.check, permissionMiddleware.check, navigationMiddleware.checkOne] }, navigationController.updateOne);
    fastify.delete('/delete', { preHandler: [requestMiddleware.check(navigationSchema.deleteMany), sessionMiddleware.check, permissionMiddleware.check, navigationMiddleware.checkMany] }, navigationController.deleteMany);
    done();
}