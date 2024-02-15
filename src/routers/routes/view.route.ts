import { FastifyInstance } from 'fastify';
import {ViewController} from "../../controllers/view.controller";
import {ViewSchema} from "../../schemas/view.schema";
import {ViewMiddleware} from "../../middlewares/view.middleware";
import {RequestMiddleware} from "../../middlewares/validates/request.middleware";
import {SessionAuthMiddleware} from "../../middlewares/validates/sessionAuth.middleware";
import {ViewEndPoint} from "../../constants/endPoints/view.endPoint";

export const viewRoute = function (fastify: FastifyInstance, opts: any, done: () => void) {
    const viewEndPoint = new ViewEndPoint("");
    fastify.get(viewEndPoint.GET_NUMBER, { preHandler: [SessionAuthMiddleware.check] }, ViewController.getNumber);
    fastify.get(viewEndPoint.GET_STATISTICS, { preHandler: [SessionAuthMiddleware.check] }, ViewController.getStatistics);
    fastify.post(viewEndPoint.ADD, { preHandler: [RequestMiddleware.check(ViewSchema.post), ViewMiddleware.check, ViewMiddleware.checkAndDeleteMany] }, ViewController.add);
    done();
}