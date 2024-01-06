import { FastifyRequest, FastifyReply } from 'fastify';
import {ErrorCodes, Result, StatusCodes} from "../library/api";
import zod from "zod";
import mailerSchema from "../schemas/mailer.schema";
import * as NodeMailer from "nodemailer";
import settingService from "../services/setting.service";
import MongoDBHelpers from "../library/mongodb/helpers";
import logMiddleware from "../middlewares/log.middleware";

export default {
    set: async (
        req: FastifyRequest<{Body: (zod.infer<typeof mailerSchema.post>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let setting = (await settingService.get({}, true));
            let contactForm = setting.contactForms?.findSingle("_id", MongoDBHelpers.createObjectId(req.body.contactFormId));
            if(contactForm){
                try {
                    let transporter = NodeMailer.createTransport({
                        host: contactForm.outGoingServer,
                        port: contactForm.port,
                        secure: contactForm.port == 465,
                        auth: {
                            user: contactForm.email,
                            pass: contactForm.password
                        },
                        tls: {
                            rejectUnauthorized: false
                        }
                    });

                    if(await transporter.verify()){
                        serviceResult.data = [];

                        let sendMail = await transporter.sendMail({
                            from: contactForm.email,
                            to: contactForm.outGoingEmail,
                            subject: contactForm.name,
                            html: req.body.message,
                            replyTo: req.body.email
                        });

                        serviceResult.data.push({
                            "_id": sendMail.messageId,
                            "response": sendMail.response
                        });

                        if(req.body.replyMessage) {
                            let sendMailReply = await transporter.sendMail({
                                from: contactForm.email,
                                to: req.body.email,
                                subject: contactForm.name,
                                html: req.body.replyMessage,
                                replyTo: req.body.email
                            });
                            serviceResult.data.push({
                                "_id": sendMailReply.messageId,
                                "response": sendMailReply.response
                            });
                        }


                    }else {
                        serviceResult.status = false;
                        serviceResult.statusCode = StatusCodes.conflict;
                        serviceResult.errorCode = ErrorCodes.incorrectData;
                    }
                }catch (e) {
                    serviceResult.status = false;
                    serviceResult.statusCode = StatusCodes.conflict;
                    serviceResult.errorCode = ErrorCodes.incorrectData;
                    serviceResult.customData = e;
                }
            }else {
                serviceResult.status = false;
                serviceResult.statusCode = StatusCodes.conflict;
                serviceResult.errorCode = ErrorCodes.incorrectData;
            }

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
};