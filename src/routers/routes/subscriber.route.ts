import { FastifyInstance } from 'fastify';
import subscriberSchema from "../../schemas/subscriber.schema";
import subscriberController from "../../controllers/subscriber.controller";
import subscriberMiddleware from "../../middlewares/subscriber.middleware";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(SubscriberEndPoint.GET, { preHandler: [requestMiddleware.check(subscriberSchema.getMany), sessionMiddleware.check, permissionMiddleware.check] }, subscriberController.getMany);
    fastify.get(SubscriberEndPoint.GET_WITH_ID, { preHandler: [requestMiddleware.check(subscriberSchema.get), sessionMiddleware.check, permissionMiddleware.check] }, subscriberController.getOne);
    fastify.post(SubscriberEndPoint.ADD, { preHandler: [requestMiddleware.check(subscriberSchema.post), subscriberMiddleware.check(true)] }, subscriberController.add);
    fastify.delete(SubscriberEndPoint.DELETE, { preHandler: [requestMiddleware.check(subscriberSchema.deleteMany), sessionMiddleware.check, permissionMiddleware.check, subscriberMiddleware.checkMany]}, subscriberController.deleteMany);
    fastify.delete(SubscriberEndPoint.DELETE_WITH_ID, { preHandler: [requestMiddleware.check(subscriberSchema.delete), subscriberMiddleware.check(false)] }, subscriberController.deleteOne);
    done();
}