import { FastifyInstance } from 'fastify';
import mailerSchema from "../../schemas/mailer.schema";
import mailerMiddleware from "../../middlewares/mailer.middleware";
import mailerController from "../../controllers/mailer.controller";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import mailerEndPoint from "../../constants/endPoints/mailer.endPoint";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.post(mailerEndPoint.SEND, { preHandler: [requestMiddleware.check(mailerSchema.post), mailerMiddleware.checkContactForm] }, mailerController.send);
    done();
}