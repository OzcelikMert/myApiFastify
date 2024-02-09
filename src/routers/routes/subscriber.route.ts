import { FastifyInstance } from 'fastify';
import subscriberSchema from "../../schemas/subscriber.schema";
import subscriberController from "../../controllers/subscriber.controller";
import subscriberMiddleware from "../../middlewares/subscriber.middleware";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";
import {SubscriberEndPoint} from "../../constants/endPoints/subscriber.endPoint";
import {SubscriberEndPointPermission} from "../../constants/endPointPermissions/subscriber.endPoint.permission";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(SubscriberEndPoint.GET, { preHandler: [requestMiddleware.check(subscriberSchema.getMany), sessionMiddleware.check, permissionMiddleware.check(SubscriberEndPointPermission.GET)] }, subscriberController.getMany);
    fastify.get(SubscriberEndPoint.GET_WITH_EMAIL, { preHandler: [requestMiddleware.check(subscriberSchema.getOneWithEmail)] }, subscriberController.getOneWithEmail);
    fastify.get(SubscriberEndPoint.GET_WITH_ID, { preHandler: [requestMiddleware.check(subscriberSchema.getOne), sessionMiddleware.check] }, subscriberController.getOne);
    fastify.post(SubscriberEndPoint.ADD, { preHandler: [requestMiddleware.check(subscriberSchema.post), subscriberMiddleware.checkOne(true)] }, subscriberController.add);
    fastify.delete(SubscriberEndPoint.DELETE, { preHandler: [requestMiddleware.check(subscriberSchema.deleteMany), sessionMiddleware.check, permissionMiddleware.check(SubscriberEndPointPermission.DELETE), subscriberMiddleware.checkMany]}, subscriberController.deleteMany);
    fastify.delete(SubscriberEndPoint.DELETE_WITH_EMAIL, { preHandler: [requestMiddleware.check(subscriberSchema.deleteOneWithEmail), subscriberMiddleware.checkOne(false)] }, subscriberController.deleteOneWithEmail);
    fastify.delete(SubscriberEndPoint.DELETE_WITH_ID, { preHandler: [requestMiddleware.check(subscriberSchema.deleteOne), subscriberMiddleware.checkOne(false)] }, subscriberController.deleteOne);
    done();
}