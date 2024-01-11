import { FastifyInstance } from 'fastify';
import userController from "../../controllers/user.controller";
import userSchema from "../../schemas/user.schema";
import userMiddleware from "../../middlewares/user.middleware";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(UserEndPoint.GET, { preHandler: [sessionMiddleware.check] }, userController.getMany);
    fastify.get(UserEndPoint.GET_WITH_ID, { preHandler: [requestMiddleware.check(userSchema.get), sessionMiddleware.check] }, userController.getOne);
    fastify.post(UserEndPoint.ADD, { preHandler: [requestMiddleware.check(userSchema.post), sessionMiddleware.check, permissionMiddleware.check, userMiddleware.checkRoleRank, userMiddleware.checkAlreadyEmail] }, userController.add);
    fastify.put(UserEndPoint.UPDATE_PROFILE, { preHandler: [requestMiddleware.check(userSchema.putProfile), sessionMiddleware.check] }, userController.updateProfile);
    fastify.put(UserEndPoint.UPDATE_CHANGE_PASSWORD, { preHandler: [requestMiddleware.check(userSchema.putPassword), sessionMiddleware.check, userMiddleware.checkPasswordWithSessionEmail] }, userController.updatePassword);
    fastify.put(UserEndPoint.UPDATE_WITH_ID, { preHandler: [requestMiddleware.check(userSchema.put), sessionMiddleware.check, permissionMiddleware.check, userMiddleware.check, userMiddleware.checkRoleRank, userMiddleware.checkAlreadyEmail] }, userController.updateOne);
    fastify.delete(UserEndPoint.DELETE_WITH_ID, { preHandler: [requestMiddleware.check(userSchema.delete), sessionMiddleware.check, permissionMiddleware.check, userMiddleware.check, userMiddleware.checkRoleRank] }, userController.deleteOne);
    done();
}