import { FastifyInstance } from 'fastify';
import {PermissionMiddleware} from "@middlewares/validates/permission.middleware";
import {SessionAuthMiddleware} from "@middlewares/validates/sessionAuth.middleware";
import {RequestMiddleware} from "@middlewares/validates/request.middleware";
import {ComponentEndPoint} from "@constants/endPoints/component.endPoint";
import {ComponentSchema} from "@schemas/component.schema";
import {ComponentController} from "@controllers/component.controller";
import {ComponentEndPointPermission} from "@constants/endPointPermissions/component.endPoint.permission";
import {ComponentMiddleware} from "@middlewares/component.middleware";

export const componentRoute = function (fastify: FastifyInstance, opts: any, done: () => void) {
    const componentEndPoint = new ComponentEndPoint("");
    fastify.get(componentEndPoint.GET, { preHandler: [RequestMiddleware.check(ComponentSchema.getMany)] }, ComponentController.getMany);
    fastify.get(componentEndPoint.GET_WITH_ID, { preHandler: [RequestMiddleware.check(ComponentSchema.getWithId)] }, ComponentController.getWithId);
    fastify.get(componentEndPoint.GET_WITH_KEY, { preHandler: [RequestMiddleware.check(ComponentSchema.getWithKey)] }, ComponentController.getWithKey);
    fastify.post(componentEndPoint.ADD, { preHandler: [RequestMiddleware.check(ComponentSchema.post), SessionAuthMiddleware.check, PermissionMiddleware.check(ComponentEndPointPermission.ADD)] }, ComponentController.add);
    fastify.put(componentEndPoint.UPDATE_WITH_ID, { preHandler: [RequestMiddleware.check(ComponentSchema.putWithId), SessionAuthMiddleware.check, PermissionMiddleware.check(ComponentEndPointPermission.UPDATE), ComponentMiddleware.checkWithId, ComponentMiddleware.checkPermissionWithId] }, ComponentController.updateWithId);
    fastify.delete(componentEndPoint.DELETE, { preHandler: [RequestMiddleware.check(ComponentSchema.deleteMany), SessionAuthMiddleware.check, PermissionMiddleware.check(ComponentEndPointPermission.DELETE), ComponentMiddleware.checkMany] }, ComponentController.deleteMany);
    done();
}