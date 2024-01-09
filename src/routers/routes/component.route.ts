import { FastifyInstance } from 'fastify';
import componentSchema from "../../schemas/component.schema";
import componentMiddleware from "../../middlewares/component.middleware";
import componentController from "../../controllers/component.controller";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(ComponentEndPoint.GET, { preHandler: [requestMiddleware.check(componentSchema.getMany)] }, componentController.getMany);
    fastify.get(ComponentEndPoint.GET_WITH_ID, { preHandler: [requestMiddleware.check(componentSchema.get)] }, componentController.getOne);
    fastify.post(ComponentEndPoint.ADD, { preHandler: [requestMiddleware.check(componentSchema.post), sessionMiddleware.check, permissionMiddleware.check] }, componentController.add);
    fastify.put(ComponentEndPoint.UPDATE_WITH_ID, { preHandler: [requestMiddleware.check(componentSchema.put), sessionMiddleware.check, permissionMiddleware.check, componentMiddleware.check] }, componentController.updateOne);
    fastify.delete(ComponentEndPoint.DELETE, { preHandler: [requestMiddleware.check(componentSchema.deleteMany), sessionMiddleware.check, permissionMiddleware.check, componentMiddleware.checkMany] }, componentController.deleteMany);
    done();
}