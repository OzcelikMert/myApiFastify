import { FastifyInstance } from 'fastify';
import {ViewController} from "../../controllers/view.controller";
import viewSchema from "../../schemas/view.schema";
import viewMiddleware from "../../middlewares/view.middleware";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import {ViewEndPoint} from "../../constants/endPoints/view.endPoint";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(ViewEndPoint.GET_NUMBER, { preHandler: [sessionMiddleware.check] }, ViewController.getNumber);
    fastify.get(ViewEndPoint.GET_STATISTICS, { preHandler: [sessionMiddleware.check] }, ViewController.getStatistics);
    fastify.post(ViewEndPoint.ADD, { preHandler: [requestMiddleware.check(viewSchema.post), viewMiddleware.check, viewMiddleware.checkAndDeleteMany] }, ViewController.add);
    done();
}