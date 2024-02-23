import { FastifyInstance } from 'fastify';
import {SubscriberSchema} from "../../schemas/subscriber.schema";
import {SubscriberController} from "../../controllers/subscriber.controller";
import {SubscribeMiddleware} from "../../middlewares/subscriber.middleware";
import {RequestMiddleware} from "../../middlewares/validates/request.middleware";
import {SessionAuthMiddleware} from "../../middlewares/validates/sessionAuth.middleware";
import {PermissionMiddleware} from "../../middlewares/validates/permission.middleware";
import {SubscriberEndPoint} from "../../constants/endPoints/subscriber.endPoint";
import {SubscriberEndPointPermission} from "../../constants/endPointPermissions/subscriber.endPoint.permission";

export const subscriberRoute = function (fastify: FastifyInstance, opts: any, done: () => void) {
    const subscriberEndPoint = new SubscriberEndPoint("");
    fastify.get(subscriberEndPoint.GET, { preHandler: [RequestMiddleware.check(SubscriberSchema.getMany), SessionAuthMiddleware.check, PermissionMiddleware.check(SubscriberEndPointPermission.GET)] }, SubscriberController.getMany);
    fastify.get(subscriberEndPoint.GET_WITH_EMAIL, { preHandler: [RequestMiddleware.check(SubscriberSchema.getWithEmail)] }, SubscriberController.getWithEmail);
    fastify.get(subscriberEndPoint.GET_WITH_ID, { preHandler: [RequestMiddleware.check(SubscriberSchema.getWithId), SessionAuthMiddleware.check] }, SubscriberController.getWithId);
    fastify.post(subscriberEndPoint.ADD, { preHandler: [RequestMiddleware.check(SubscriberSchema.post), SubscribeMiddleware.checkWithId(true)] }, SubscriberController.add);
    fastify.delete(subscriberEndPoint.DELETE, { preHandler: [RequestMiddleware.check(SubscriberSchema.deleteMany), SessionAuthMiddleware.check, PermissionMiddleware.check(SubscriberEndPointPermission.DELETE), SubscribeMiddleware.checkMany]}, SubscriberController.deleteMany);
    fastify.delete(subscriberEndPoint.DELETE_WITH_EMAIL, { preHandler: [RequestMiddleware.check(SubscriberSchema.deleteWithEmail), SubscribeMiddleware.checkWithId(false)] }, SubscriberController.deleteWithEmail);
    fastify.delete(subscriberEndPoint.DELETE_WITH_ID, { preHandler: [RequestMiddleware.check(SubscriberSchema.deleteWithId), SubscribeMiddleware.checkWithId(false)] }, SubscriberController.deleteWithId);
    done();
}