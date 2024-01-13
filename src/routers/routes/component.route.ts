import { FastifyInstance } from 'fastify';
import componentSchema from "../../schemas/component.schema";
import componentMiddleware from "../../middlewares/component.middleware";
import componentController from "../../controllers/component.controller";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";
import componentEndPoint from "../../constants/endPoints/component.endPoint";
import componentPermission from "../../constants/permissions/component.permission";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(componentEndPoint.GET, { preHandler: [requestMiddleware.check(componentSchema.getMany)] }, componentController.getMany);
    fastify.get(componentEndPoint.GET_WITH_ID, { preHandler: [requestMiddleware.check(componentSchema.get)] }, componentController.getOne);
    fastify.post(componentEndPoint.ADD, { preHandler: [requestMiddleware.check(componentSchema.post), sessionMiddleware.check, permissionMiddleware.check(componentPermission.add)] }, componentController.add);
    fastify.put(componentEndPoint.UPDATE_WITH_ID, { preHandler: [requestMiddleware.check(componentSchema.put), sessionMiddleware.check, permissionMiddleware.check(componentPermission.update), componentMiddleware.check] }, componentController.updateOne);
    fastify.delete(componentEndPoint.DELETE, { preHandler: [requestMiddleware.check(componentSchema.deleteMany), sessionMiddleware.check, permissionMiddleware.check(componentPermission.delete), componentMiddleware.checkMany] }, componentController.deleteMany);
    done();
}