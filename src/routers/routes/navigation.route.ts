import { FastifyInstance } from 'fastify';
import {NavigationSchema} from "@schemas/navigation.schema";
import {NavigationController} from "@controllers/navigation.controller";
import {NavigationMiddleware} from "@middlewares/navigation.middleware";
import {PermissionMiddleware} from "@middlewares/validates/permission.middleware";
import {SessionAuthMiddleware} from "@middlewares/validates/sessionAuth.middleware";
import {RequestMiddleware} from "@middlewares/validates/request.middleware";
import {NavigationEndPoint} from "@constants/endPoints/navigation.endPoint";
import {NavigationEndPointPermission} from "@constants/endPointPermissions/navigation.endPoint.permission";

export const navigationRoute = function (fastify: FastifyInstance, opts: any, done: () => void) {
    const navigationEndPoint = new NavigationEndPoint("");
    fastify.get(navigationEndPoint.GET, { preHandler: [RequestMiddleware.check(NavigationSchema.getMany)] }, NavigationController.getMany);
    fastify.get(navigationEndPoint.GET_WITH_ID, { preHandler: [RequestMiddleware.check(NavigationSchema.getWithId)] }, NavigationController.getWithId);
    fastify.post(navigationEndPoint.ADD, { preHandler: [RequestMiddleware.check(NavigationSchema.post), SessionAuthMiddleware.check, PermissionMiddleware.check(NavigationEndPointPermission.ADD)] }, NavigationController.add);
    fastify.put(navigationEndPoint.UPDATE_RANK_WITH_ID, { preHandler: [RequestMiddleware.check(NavigationSchema.putRankWithId), SessionAuthMiddleware.check, PermissionMiddleware.check(NavigationEndPointPermission.UPDATE), NavigationMiddleware.checkWithId] }, NavigationController.updateRankWithId);
    fastify.put(navigationEndPoint.UPDATE_STATUS, { preHandler: [RequestMiddleware.check(NavigationSchema.putStatusMany), SessionAuthMiddleware.check, PermissionMiddleware.check(NavigationEndPointPermission.UPDATE), NavigationMiddleware.checkMany] }, NavigationController.updateStatusMany);
    fastify.put(navigationEndPoint.UPDATE_WITH_ID, { preHandler: [RequestMiddleware.check(NavigationSchema.putWithId), SessionAuthMiddleware.check, PermissionMiddleware.check(NavigationEndPointPermission.UPDATE), NavigationMiddleware.checkWithId] }, NavigationController.updateWithId);
    fastify.delete(navigationEndPoint.DELETE, { preHandler: [RequestMiddleware.check(NavigationSchema.deleteMany), SessionAuthMiddleware.check, PermissionMiddleware.check(NavigationEndPointPermission.DELETE), NavigationMiddleware.checkMany] }, NavigationController.deleteMany);
    done();
}