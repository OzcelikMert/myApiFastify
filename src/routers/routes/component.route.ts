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
    const endPoint = new ComponentEndPoint("");
    fastify.get(endPoint.GET, { preHandler: [RequestMiddleware.check(ComponentSchema.getMany)] }, ComponentController.getMany);
    fastify.get(endPoint.GET_WITH_ID, { preHandler: [RequestMiddleware.check(ComponentSchema.getWithId)] }, ComponentController.getWithId);
    fastify.get(endPoint.GET_WITH_KEY, { preHandler: [RequestMiddleware.check(ComponentSchema.getWithKey)] }, ComponentController.getWithKey);
    fastify.post(endPoint.ADD, { preHandler: [RequestMiddleware.check(ComponentSchema.post), SessionAuthMiddleware.check, PermissionMiddleware.check(ComponentEndPointPermission.ADD)] }, ComponentController.add);
    fastify.put(endPoint.UPDATE_WITH_ID, { preHandler: [RequestMiddleware.check(ComponentSchema.putWithId), SessionAuthMiddleware.check, PermissionMiddleware.check(ComponentEndPointPermission.UPDATE), ComponentMiddleware.checkWithId, ComponentMiddleware.checkPermissionWithId] }, ComponentController.updateWithId);
    fastify.delete(endPoint.DELETE, { preHandler: [RequestMiddleware.check(ComponentSchema.deleteMany), SessionAuthMiddleware.check, PermissionMiddleware.check(ComponentEndPointPermission.DELETE), ComponentMiddleware.checkMany] }, ComponentController.deleteMany);
    done();
}