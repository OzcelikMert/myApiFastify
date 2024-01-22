import { FastifyInstance } from 'fastify';
import userController from "../../controllers/user.controller";
import userSchema from "../../schemas/user.schema";
import userMiddleware from "../../middlewares/user.middleware";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";
import userPermission from '../../constants/permissions/user.permission';
import userEndPoint from "../../constants/endPoints/user.endPoint";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(userEndPoint.GET, { preHandler: [sessionMiddleware.check] }, userController.getMany);
    fastify.get(userEndPoint.GET_WITH_ID, { preHandler: [requestMiddleware.check(userSchema.getOne), sessionMiddleware.check] }, userController.getOne);
    fastify.get(userEndPoint.GET_WITH_URL, { preHandler: [requestMiddleware.check(userSchema.getOneWithURL)] }, userController.getOne);
    fastify.post(userEndPoint.ADD, { preHandler: [requestMiddleware.check(userSchema.post), sessionMiddleware.check, permissionMiddleware.check(userPermission.add), userMiddleware.checkRoleRank, userMiddleware.checkAlreadyEmail] }, userController.add);
    fastify.put(userEndPoint.UPDATE_PROFILE, { preHandler: [requestMiddleware.check(userSchema.putProfile), sessionMiddleware.check] }, userController.updateProfile);
    fastify.put(userEndPoint.UPDATE_CHANGE_PASSWORD, { preHandler: [requestMiddleware.check(userSchema.putPassword), sessionMiddleware.check, userMiddleware.checkPasswordWithSessionEmail] }, userController.updatePassword);
    fastify.put(userEndPoint.UPDATE_WITH_ID, { preHandler: [requestMiddleware.check(userSchema.putOne), sessionMiddleware.check, permissionMiddleware.check(userPermission.update), userMiddleware.checkOne, userMiddleware.checkRoleRank, userMiddleware.checkAlreadyEmail] }, userController.updateOne);
    fastify.delete(userEndPoint.DELETE_WITH_ID, { preHandler: [requestMiddleware.check(userSchema.deleteOne), sessionMiddleware.check, permissionMiddleware.check(userPermission.delete), userMiddleware.checkOne, userMiddleware.checkRoleRank] }, userController.deleteOne);
    done();
}