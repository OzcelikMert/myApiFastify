import { FastifyRequest, FastifyReply } from 'fastify';
import {ApiResult} from "@library/api/result";
import {ApiErrorCodes} from "@library/api/errorCodes";
import {ApiStatusCodes} from "@library/api/statusCodes";
import {IMailerPostSchema} from "@schemas/mailer.schema";
import * as NodeMailer from "nodemailer";
import {LogMiddleware} from "@middlewares/log.middleware";

const send = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<{_id: string, response: string, contactFormId: string}[], any>();
        apiResult.data = [];

        let reqData = req as IMailerPostSchema;

        if(req.cachedServiceResult){
            let contactForm = req.cachedServiceResult;

            try {
                let transporter = NodeMailer.createTransport({
                    host: contactForm.host,
                    port: contactForm.port,
                    secure: contactForm.hasSSL,
                    auth: {
                        user: contactForm.email,
                        pass: contactForm.password
                    },
                    tls: {
                        rejectUnauthorized: contactForm.hasSSL
                    }
                });

                if(await transporter.verify()){

                    let sendMail = await transporter.sendMail({
                        from: contactForm.email,
                        to: contactForm.targetEmail,
                        subject: contactForm.name,
                        html: reqData.body.message,
                        replyTo: reqData.body.email
                    });

                    apiResult.data?.push({
                        _id: sendMail.messageId,
                        response: sendMail.response,
                        contactFormId: contactForm._id
                    });

                    /*if(reqData.body.replyMessage) {
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
                    }*/


                }else {
                    apiResult.status = false;
                    apiResult.setStatusCode = ApiStatusCodes.unauthorized;
                    apiResult.setErrorCode = ApiErrorCodes.incorrectData;
                }
            }catch (e: any) {
                apiResult.status = false;
                apiResult.setStatusCode = ApiStatusCodes.unauthorized;
                apiResult.setErrorCode = ApiErrorCodes.incorrectData;
                apiResult.customData = e;
            }
        }else {
            apiResult.status = false;
            apiResult.setStatusCode = ApiStatusCodes.notFound;
            apiResult.setErrorCode = ApiErrorCodes.notFound;
        }

        await reply.status(apiResult.getStatusCode).send(apiResult)
    });
}

export const MailerController = {
    send: send,
};