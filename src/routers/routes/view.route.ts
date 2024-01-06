import { FastifyInstance } from 'fastify';
import viewController from "../../controllers/view.controller";
import viewSchema from "../../schemas/view.schema";
import viewMiddleware from "../../middlewares/view.middleware";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get('/get/number', { preHandler: [sessionMiddleware.check] }, viewController.getNumber);
    fastify.get('/get/statistics', { preHandler: [sessionMiddleware.check] }, viewController.getStatistics);
    fastify.post('/add', { preHandler: [requestMiddleware.check(viewSchema.post), viewMiddleware.checkOne, viewMiddleware.checkAndDeleteMany] }, viewController.add);
    done();
}