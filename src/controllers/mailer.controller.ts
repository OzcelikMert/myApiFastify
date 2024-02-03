import { FastifyRequest, FastifyReply } from 'fastify';
import {ApiResult} from "../library/api/result";
import {ApiErrorCodes} from "../library/api/errorCodes";
import {ApiStatusCodes} from "../library/api/statusCodes";
import {MailerSchemaPostDocument} from "../schemas/mailer.schema";
import * as NodeMailer from "nodemailer";
import settingService from "../services/setting.service";
import MongoDBHelpers from "../library/mongodb/helpers";
import logMiddleware from "../middlewares/log.middleware";

const send = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as MailerSchemaPostDocument;

        let setting = (await settingService.get({}, true));

        if(setting){
            let contactForm = setting.contactForms?.findSingle("_id", MongoDBHelpers.createObjectId(reqData.body.contactFormId));
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
                            html: reqData.body.message,
                            replyTo: reqData.body.email
                        });

                        serviceResult.data.push({
                            "_id": sendMail.messageId,
                            "response": sendMail.response
                        });

                        if(reqData.body.replyMessage) {
                            let sendMailReply = await transporter.sendMail({
                                from: contactForm.email,
                                to: reqData.body.email,
                                subject: contactForm.name,
                                html: reqData.body.replyMessage,
                                replyTo: reqData.body.email
                            });
                            serviceResult.data.push({
                                "_id": sendMailReply.messageId,
                                "response": sendMailReply.response
                            });
                        }


                    }else {
                        serviceResult.status = false;
                        serviceResult.statusCode = ApiStatusCodes.conflict;
                        serviceResult.errorCode = ApiErrorCodes.incorrectData;
                    }
                }catch (e) {
                    serviceResult.status = false;
                    serviceResult.statusCode = ApiStatusCodes.conflict;
                    serviceResult.errorCode = ApiErrorCodes.incorrectData;
                    serviceResult.customData = e;
                }
            }else {
                serviceResult.status = false;
                serviceResult.statusCode = ApiStatusCodes.conflict;
                serviceResult.errorCode = ApiErrorCodes.incorrectData;
            }
        }

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

export default {
    send: send,
};