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
    fastify.get(SubscriberEndPoint.GET, { preHandler: [RequestMiddleware.check(SubscriberSchema.getMany), SessionAuthMiddleware.check, PermissionMiddleware.check(SubscriberEndPointPermission.GET)] }, SubscriberController.getMany);
    fastify.get(SubscriberEndPoint.GET_WITH_EMAIL, { preHandler: [RequestMiddleware.check(SubscriberSchema.getOneWithEmail)] }, SubscriberController.getOneWithEmail);
    fastify.get(SubscriberEndPoint.GET_WITH_ID, { preHandler: [RequestMiddleware.check(SubscriberSchema.getOne), SessionAuthMiddleware.check] }, SubscriberController.getOne);
    fastify.post(SubscriberEndPoint.ADD, { preHandler: [RequestMiddleware.check(SubscriberSchema.post), SubscribeMiddleware.checkOne(true)] }, SubscriberController.add);
    fastify.delete(SubscriberEndPoint.DELETE, { preHandler: [RequestMiddleware.check(SubscriberSchema.deleteMany), SessionAuthMiddleware.check, PermissionMiddleware.check(SubscriberEndPointPermission.DELETE), SubscribeMiddleware.checkMany]}, SubscriberController.deleteMany);
    fastify.delete(SubscriberEndPoint.DELETE_WITH_EMAIL, { preHandler: [RequestMiddleware.check(SubscriberSchema.deleteOneWithEmail), SubscribeMiddleware.checkOne(false)] }, SubscriberController.deleteOneWithEmail);
    fastify.delete(SubscriberEndPoint.DELETE_WITH_ID, { preHandler: [RequestMiddleware.check(SubscriberSchema.deleteOne), SubscribeMiddleware.checkOne(false)] }, SubscriberController.deleteOne);
    done();
}