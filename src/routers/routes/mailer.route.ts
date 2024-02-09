import { FastifyInstance } from 'fastify';
import mailerSchema from "../../schemas/mailer.schema";
import mailerMiddleware from "../../middlewares/mailer.middleware";
import {MailerController} from "../../controllers/mailer.controller";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import {MailerEndPoint} from "../../constants/endPoints/mailer.endPoint";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.post(MailerEndPoint.SEND, { preHandler: [requestMiddleware.check(mailerSchema.post), mailerMiddleware.checkContactForm] }, MailerController.send);
    done();
}