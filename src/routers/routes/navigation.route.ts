import { FastifyInstance } from 'fastify';
import {NavigationSchema} from "../../schemas/navigation.schema";
import {NavigationController} from "../../controllers/navigation.controller";
import {NavigationMiddleware} from "../../middlewares/navigation.middleware";
import {PermissionMiddleware} from "../../middlewares/validates/permission.middleware";
import {SessionAuthMiddleware} from "../../middlewares/validates/sessionAuth.middleware";
import {RequestMiddleware} from "../../middlewares/validates/request.middleware";
import {NavigationEndPoint} from "../../constants/endPoints/navigation.endPoint";
import {NavigationEndPointPermission} from "../../constants/endPointPermissions/navigation.endPoint.permission";

export const navigationRoute = function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(NavigationEndPoint.GET, { preHandler: [RequestMiddleware.check(NavigationSchema.getMany)] }, NavigationController.getMany);
    fastify.get(NavigationEndPoint.GET_WITH_ID, { preHandler: [RequestMiddleware.check(NavigationSchema.getOne)] }, NavigationController.getOne);
    fastify.post(NavigationEndPoint.ADD, { preHandler: [RequestMiddleware.check(NavigationSchema.post), SessionAuthMiddleware.check, PermissionMiddleware.check(NavigationEndPointPermission.ADD)] }, NavigationController.add);
    fastify.put(NavigationEndPoint.UPDATE_RANK_WITH_ID, { preHandler: [RequestMiddleware.check(NavigationSchema.putOneRank), SessionAuthMiddleware.check, PermissionMiddleware.check(NavigationEndPointPermission.UPDATE), NavigationMiddleware.checkOne] }, NavigationController.updateOneRank);
    fastify.put(NavigationEndPoint.UPDATE_STATUS, { preHandler: [RequestMiddleware.check(NavigationSchema.putManyStatus), SessionAuthMiddleware.check, PermissionMiddleware.check(NavigationEndPointPermission.UPDATE), NavigationMiddleware.checkMany] }, NavigationController.updateManyStatus);
    fastify.put(NavigationEndPoint.UPDATE_WITH_ID, { preHandler: [RequestMiddleware.check(NavigationSchema.putOne), SessionAuthMiddleware.check, PermissionMiddleware.check(NavigationEndPointPermission.UPDATE), NavigationMiddleware.checkOne] }, NavigationController.updateOne);
    fastify.delete(NavigationEndPoint.DELETE, { preHandler: [RequestMiddleware.check(NavigationSchema.deleteMany), SessionAuthMiddleware.check, PermissionMiddleware.check(NavigationEndPointPermission.DELETE), NavigationMiddleware.checkMany] }, NavigationController.deleteMany);
    done();
}