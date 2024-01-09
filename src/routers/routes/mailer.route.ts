import { FastifyInstance } from 'fastify';
import mailerSchema from "../../schemas/mailer.schema";
import mailerMiddleware from "../../middlewares/mailer.middleware";
import mailerController from "../../controllers/mailer.controller";
import requestMiddleware from "../../middlewares/validates/request.middleware";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.post(MailerEndPoint.SEND, { preHandler: [requestMiddleware.check(mailerSchema.post), mailerMiddleware.checkContactForm] }, mailerController.send);
    done();
}