import { FastifyInstance } from 'fastify';
import componentSchema from "../../schemas/component.schema";
import componentMiddleware from "../../middlewares/component.middleware";
import componentController from "../../controllers/component.controller";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get('/get', { preHandler: [requestMiddleware.check(componentSchema.getMany)] }, componentController.getMany);
    fastify.get('/get/:_id', { preHandler: [requestMiddleware.check(componentSchema.get)] }, componentController.getOne);
    fastify.post('/add', { preHandler: [requestMiddleware.check(componentSchema.post), sessionMiddleware.check, permissionMiddleware.check] }, componentController.add);
    fastify.put('/update/:_id', { preHandler: [requestMiddleware.check(componentSchema.put), sessionMiddleware.check, permissionMiddleware.check, componentMiddleware.check] }, componentController.updateOne);
    fastify.delete('/delete', { preHandler: [requestMiddleware.check(componentSchema.deleteMany), sessionMiddleware.check, permissionMiddleware.check, componentMiddleware.checkMany] }, componentController.deleteMany);
    done();
}