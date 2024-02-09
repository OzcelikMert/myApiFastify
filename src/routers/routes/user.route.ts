import { FastifyInstance } from 'fastify';
import {UserController} from "../../controllers/user.controller";
import userSchema from "../../schemas/user.schema";
import userMiddleware from "../../middlewares/user.middleware";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";
import {UserEndPointPermission} from '../../constants/endPointPermissions/user.endPoint.permission';
import {UserEndPoint} from "../../constants/endPoints/user.endPoint";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(UserEndPoint.GET, { preHandler: [sessionMiddleware.check] }, UserController.getMany);
    fastify.get(UserEndPoint.GET_WITH_URL, { preHandler: [requestMiddleware.check(userSchema.getOneWithURL)] }, UserController.getOneWithURL);
    fastify.get(UserEndPoint.GET_WITH_ID, { preHandler: [requestMiddleware.check(userSchema.getOne), sessionMiddleware.check] }, UserController.getOne);
    fastify.post(UserEndPoint.ADD, { preHandler: [requestMiddleware.check(userSchema.post), sessionMiddleware.check, permissionMiddleware.check(UserEndPointPermission.ADD), userMiddleware.checkRoleRank, userMiddleware.checkAlreadyEmail] }, UserController.add);
    fastify.put(UserEndPoint.UPDATE_PROFILE, { preHandler: [requestMiddleware.check(userSchema.putProfile), sessionMiddleware.check] }, UserController.updateProfile);
    fastify.put(UserEndPoint.UPDATE_PASSWORD, { preHandler: [requestMiddleware.check(userSchema.putPassword), sessionMiddleware.check, userMiddleware.checkPasswordWithSessionEmail] }, UserController.updatePassword);
    fastify.put(UserEndPoint.UPDATE_WITH_ID, { preHandler: [requestMiddleware.check(userSchema.putOne), sessionMiddleware.check, permissionMiddleware.check(UserEndPointPermission.UPDATE), userMiddleware.checkOne, userMiddleware.checkRoleRank, userMiddleware.checkAlreadyEmail] }, UserController.updateOne);
    fastify.delete(UserEndPoint.DELETE_WITH_ID, { preHandler: [requestMiddleware.check(userSchema.deleteOne), sessionMiddleware.check, permissionMiddleware.check(UserEndPointPermission.DELETE), userMiddleware.checkOne, userMiddleware.checkRoleRank] }, UserController.deleteOne);
    done();
}