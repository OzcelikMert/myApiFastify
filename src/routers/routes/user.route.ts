import { FastifyInstance } from 'fastify';
import {UserController} from "../../controllers/user.controller";
import {UserSchema} from "../../schemas/user.schema";
import {UserMiddleware} from "../../middlewares/user.middleware";
import {RequestMiddleware} from "../../middlewares/validates/request.middleware";
import {SessionAuthMiddleware} from "../../middlewares/validates/sessionAuth.middleware";
import {PermissionMiddleware} from "../../middlewares/validates/permission.middleware";
import {UserEndPointPermission} from '../../constants/endPointPermissions/user.endPoint.permission';
import {UserEndPoint} from "../../constants/endPoints/user.endPoint";

export const userRoute = function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(UserEndPoint.GET, { preHandler: [SessionAuthMiddleware.check] }, UserController.getMany);
    fastify.get(UserEndPoint.GET_WITH_URL, { preHandler: [RequestMiddleware.check(UserSchema.getOneWithURL)] }, UserController.getOneWithURL);
    fastify.get(UserEndPoint.GET_WITH_ID, { preHandler: [RequestMiddleware.check(UserSchema.getOne), SessionAuthMiddleware.check] }, UserController.getOne);
    fastify.post(UserEndPoint.ADD, { preHandler: [RequestMiddleware.check(UserSchema.post), SessionAuthMiddleware.check, PermissionMiddleware.check(UserEndPointPermission.ADD), UserMiddleware.checkRoleRank, UserMiddleware.checkAlreadyEmail] }, UserController.add);
    fastify.put(UserEndPoint.UPDATE_PROFILE, { preHandler: [RequestMiddleware.check(UserSchema.putProfile), SessionAuthMiddleware.check] }, UserController.updateProfile);
    fastify.put(UserEndPoint.UPDATE_PASSWORD, { preHandler: [RequestMiddleware.check(UserSchema.putPassword), SessionAuthMiddleware.check, UserMiddleware.checkPasswordWithSessionEmail] }, UserController.updatePassword);
    fastify.put(UserEndPoint.UPDATE_WITH_ID, { preHandler: [RequestMiddleware.check(UserSchema.putOne), SessionAuthMiddleware.check, PermissionMiddleware.check(UserEndPointPermission.UPDATE), UserMiddleware.checkOne, UserMiddleware.checkRoleRank, UserMiddleware.checkAlreadyEmail] }, UserController.updateOne);
    fastify.delete(UserEndPoint.DELETE_WITH_ID, { preHandler: [RequestMiddleware.check(UserSchema.deleteOne), SessionAuthMiddleware.check, PermissionMiddleware.check(UserEndPointPermission.DELETE), UserMiddleware.checkOne, UserMiddleware.checkRoleRank] }, UserController.deleteOne);
    done();
}