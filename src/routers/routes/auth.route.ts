import authSchema from "../../schemas/auth.schema";
import authController from "../../controllers/auth.controller";
import { FastifyInstance } from 'fastify';
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import authEndPoint from "../../constants/endPoints/auth.endPoint";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(authEndPoint.GET, { preHandler: [sessionMiddleware.check] }, authController.getSession);
    fastify.post(authEndPoint.LOGIN, { preHandler: [requestMiddleware.check(authSchema.post)]}, authController.login);
    fastify.delete(authEndPoint.LOGOUT, { preHandler: [sessionMiddleware.check] }, authController.logOut);
    done();
}