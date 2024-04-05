import { FastifyRequest, FastifyReply } from 'fastify';
import {ApiResult} from "@library/api/result";
import {ApiErrorCodes} from "@library/api/errorCodes";
import {ApiStatusCodes} from "@library/api/statusCodes";
import {IMailerPostSchema} from "@schemas/mailer.schema";
import * as NodeMailer from "nodemailer";
import {SettingService} from "@services/setting.service";
import {LogMiddleware} from "@middlewares/log.middleware";
import {MongoDBHelpers} from "@library/mongodb/helpers";

const send = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<{_id: string, response: string}[], any>();
        apiResult.data = [];

        let reqData = req as IMailerPostSchema;

        let setting = (await SettingService.get({}, true));

        if(setting){
            let contactForm = setting.contactForms?.findSingle("_id", MongoDBHelpers.convertToObjectId(reqData.body.contactFormId));
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

                        let sendMail = await transporter.sendMail({
                            from: contactForm.email,
                            to: contactForm.outGoingEmail,
                            subject: contactForm.name,
                            html: reqData.body.message,
                            replyTo: reqData.body.email
                        });

                        apiResult.data?.push({
                            _id: sendMail.messageId,
                            response: sendMail.response
                        });

                        if(reqData.body.replyMessage) {
                            let sendMailReply = await transporter.sendMail({
                                from: contactForm.email,
                                to: reqData.body.email,
                                subject: contactForm.name,
                                html: reqData.body.replyMessage,
                                replyTo: reqData.body.email
                            });
                            apiResult.data?.push({
                                "_id": sendMailReply.messageId,
                                "response": sendMailReply.response
                            });
                        }


                    }else {
                        apiResult.status = false;
                        apiResult.statusCode = ApiStatusCodes.conflict;
                        apiResult.errorCode = ApiErrorCodes.incorrectData;
                    }
                }catch (e: any) {
                    apiResult.status = false;
                    apiResult.statusCode = ApiStatusCodes.conflict;
                    apiResult.errorCode = ApiErrorCodes.incorrectData;
                    apiResult.customData = e;
                }
            }else {
                apiResult.status = false;
                apiResult.statusCode = ApiStatusCodes.conflict;
                apiResult.errorCode = ApiErrorCodes.incorrectData;
            }
        }

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

export const MailerController = {
    send: send,
};