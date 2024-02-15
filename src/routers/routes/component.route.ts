import { FastifyInstance } from 'fastify';
import {ComponentSchema} from "../../schemas/component.schema";
import {ComponentMiddleware} from "../../middlewares/component.middleware";
import {ComponentController} from "../../controllers/component.controller";
import {RequestMiddleware} from "../../middlewares/validates/request.middleware";
import {SessionAuthMiddleware} from "../../middlewares/validates/sessionAuth.middleware";
import {PermissionMiddleware} from "../../middlewares/validates/permission.middleware";
import {ComponentEndPoint} from "../../constants/endPoints/component.endPoint";
import {ComponentEndPointPermission} from "../../constants/endPointPermissions/component.endPoint.permission";

export const componentRoute = function (fastify: FastifyInstance, opts: any, done: () => void) {
    const componentEndPoint = new ComponentEndPoint("");
    fastify.get(componentEndPoint.GET, { preHandler: [RequestMiddleware.check(ComponentSchema.getMany)] }, ComponentController.getMany);
    fastify.get(componentEndPoint.GET_WITH_ID, { preHandler: [RequestMiddleware.check(ComponentSchema.getOne)] }, ComponentController.getOne);
    fastify.post(componentEndPoint.ADD, { preHandler: [RequestMiddleware.check(ComponentSchema.post), SessionAuthMiddleware.check, PermissionMiddleware.check(ComponentEndPointPermission.ADD)] }, ComponentController.add);
    fastify.put(componentEndPoint.UPDATE_WITH_ID, { preHandler: [RequestMiddleware.check(ComponentSchema.putOne), SessionAuthMiddleware.check, PermissionMiddleware.check(ComponentEndPointPermission.UPDATE), ComponentMiddleware.checkOne] }, ComponentController.updateOne);
    fastify.delete(componentEndPoint.DELETE, { preHandler: [RequestMiddleware.check(ComponentSchema.deleteMany), SessionAuthMiddleware.check, PermissionMiddleware.check(ComponentEndPointPermission.DELETE), ComponentMiddleware.checkMany] }, ComponentController.deleteMany);
    done();
}