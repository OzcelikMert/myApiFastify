import { FastifyInstance } from 'fastify';
import subscriberSchema from "../../schemas/subscriber.schema";
import subscriberController from "../../controllers/subscriber.controller";
import subscriberMiddleware from "../../middlewares/subscriber.middleware";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";
import subscriberEndPoint from "../../constants/endPoints/subscriber.endPoint";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(subscriberEndPoint.GET, { preHandler: [requestMiddleware.check(subscriberSchema.getMany), sessionMiddleware.check, permissionMiddleware.check] }, subscriberController.getMany);
    fastify.get(subscriberEndPoint.GET_WITH_ID, { preHandler: [requestMiddleware.check(subscriberSchema.get), sessionMiddleware.check, permissionMiddleware.check] }, subscriberController.getOne);
    fastify.post(subscriberEndPoint.ADD, { preHandler: [requestMiddleware.check(subscriberSchema.post), subscriberMiddleware.check(true)] }, subscriberController.add);
    fastify.delete(subscriberEndPoint.DELETE, { preHandler: [requestMiddleware.check(subscriberSchema.deleteMany), sessionMiddleware.check, permissionMiddleware.check, subscriberMiddleware.checkMany]}, subscriberController.deleteMany);
    fastify.delete(subscriberEndPoint.DELETE_WITH_ID, { preHandler: [requestMiddleware.check(subscriberSchema.delete), subscriberMiddleware.check(false)] }, subscriberController.deleteOne);
    done();
}