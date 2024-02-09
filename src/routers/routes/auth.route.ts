import authSchema from "../../schemas/auth.schema";
import {AuthController} from "../../controllers/auth.controller";
import { FastifyInstance } from 'fastify';
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import {AuthEndPoint} from "../../constants/endPoints/auth.endPoint";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(AuthEndPoint.GET, { preHandler: [sessionMiddleware.check] }, AuthController.getSession);
    fastify.post(AuthEndPoint.LOGIN, { preHandler: [requestMiddleware.check(authSchema.post)]}, AuthController.login);
    fastify.delete(AuthEndPoint.LOGOUT, { preHandler: [sessionMiddleware.check] }, AuthController.logOut);
    done();
}