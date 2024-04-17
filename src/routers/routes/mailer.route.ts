import { FastifyInstance } from 'fastify';
import {MailerSchema} from "@schemas/mailer.schema";
import {MailerMiddleware} from "@middlewares/mailer.middleware";
import {MailerController} from "@controllers/mailer.controller";
import {RequestMiddleware} from "@middlewares/validates/request.middleware";
import {MailerEndPoint} from "@constants/endPoints/mailer.endPoint";

export const mailerRoute = function (fastify: FastifyInstance, opts: any, done: () => void) {
    const endPoint = new MailerEndPoint("");
    fastify.post(endPoint.SEND, { preHandler: [RequestMiddleware.check(MailerSchema.post), MailerMiddleware.checkContactForm] }, MailerController.send);
    done();
}