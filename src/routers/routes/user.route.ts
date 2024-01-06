import { FastifyInstance } from 'fastify';
import userController from "../../controllers/user.controller";
import userSchema from "../../schemas/user.schema";
import userMiddleware from "../../middlewares/user.middleware";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get('/get', { preHandler: [sessionMiddleware.check] }, userController.getMany);
    fastify.get('/get/:_id', { preHandler: [requestMiddleware.check(userSchema.get), sessionMiddleware.check] }, userController.getOne);
    fastify.post('/add', { preHandler: [requestMiddleware.check(userSchema.post), sessionMiddleware.check, permissionMiddleware.check, userMiddleware.checkOneRoleRank, userMiddleware.checkAlreadyEmail, userMiddleware.checkUrl] }, userController.add);
    fastify.put('/update/profile', { preHandler: [requestMiddleware.check(userSchema.putProfile), sessionMiddleware.check, userMiddleware.setIsProfile, userMiddleware.checkUrl] }, userController.updateProfile);
    fastify.put('/update/change-password', { preHandler: [requestMiddleware.check(userSchema.putPassword), sessionMiddleware.check, userMiddleware.checkPasswordWithSessionEmail] }, userController.updatePassword);
    fastify.put('/update/:_id', { preHandler: [requestMiddleware.check(userSchema.put), sessionMiddleware.check, permissionMiddleware.check, userMiddleware.checkOne, userMiddleware.checkOneRoleRank, userMiddleware.checkAlreadyEmail, userMiddleware.checkUrl] }, userController.updateOne);
    fastify.delete('/delete/:_id', { preHandler: [requestMiddleware.check(userSchema.delete), sessionMiddleware.check, permissionMiddleware.check, userMiddleware.checkOne, userMiddleware.checkOneRoleRank] }, userController.deleteOne);
    done();
}