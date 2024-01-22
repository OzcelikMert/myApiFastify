import { FastifyInstance } from 'fastify';
import subscriberSchema from "../../schemas/subscriber.schema";
import subscriberController from "../../controllers/subscriber.controller";
import subscriberMiddleware from "../../middlewares/subscriber.middleware";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";
import subscriberEndPoint from "../../constants/endPoints/subscriber.endPoint";
import subscriberPermission from "../../constants/permissions/subscriber.permission";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(subscriberEndPoint.GET, { preHandler: [requestMiddleware.check(subscriberSchema.getMany), sessionMiddleware.check, permissionMiddleware.check(subscriberPermission.get)] }, subscriberController.getMany);
    fastify.get(subscriberEndPoint.GET_WITH_ID, { preHandler: [requestMiddleware.check(subscriberSchema.getOne), sessionMiddleware.check] }, subscriberController.getOne);
    fastify.post(subscriberEndPoint.ADD, { preHandler: [requestMiddleware.check(subscriberSchema.post), subscriberMiddleware.checkOne(true)] }, subscriberController.add);
    fastify.delete(subscriberEndPoint.DELETE, { preHandler: [requestMiddleware.check(subscriberSchema.deleteMany), sessionMiddleware.check, permissionMiddleware.check(subscriberPermission.delete), subscriberMiddleware.checkMany]}, subscriberController.deleteMany);
    fastify.delete(subscriberEndPoint.DELETE_WITH_ID, { preHandler: [requestMiddleware.check(subscriberSchema.deleteOne), subscriberMiddleware.checkOne(false)] }, subscriberController.deleteOne);
    done();
}