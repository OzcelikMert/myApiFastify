import { FastifyInstance } from 'fastify';
import viewController from "../../controllers/view.controller";
import viewSchema from "../../schemas/view.schema";
import viewMiddleware from "../../middlewares/view.middleware";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import viewEndPoint from "../../constants/endPoints/view.endPoint";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(viewEndPoint.GET_NUMBER, { preHandler: [sessionMiddleware.check] }, viewController.getNumber);
    fastify.get(viewEndPoint.GET_STATISTICS, { preHandler: [sessionMiddleware.check] }, viewController.getStatistics);
    fastify.post(viewEndPoint.ADD, { preHandler: [requestMiddleware.check(viewSchema.post), viewMiddleware.check, viewMiddleware.checkAndDeleteMany] }, viewController.add);
    done();
}