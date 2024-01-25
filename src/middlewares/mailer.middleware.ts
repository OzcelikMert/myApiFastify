import { FastifyRequest, FastifyReply } from 'fastify';
import {ErrorCodes, Result, StatusCodes} from "../library/api";
import settingService from "../services/setting.service";
import logMiddleware from "./log.middleware";
import {MailerSchemaPostDocument} from "../schemas/mailer.schema";

export default {
    checkContactForm: async (req: FastifyRequest, reply: FastifyReply) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let reqData = req as MailerSchemaPostDocument;

            let setting = (await settingService.get({}));

            if(setting){
                if((typeof setting.contactForms === "undefined") || (setting.contactForms && setting.contactForms?.indexOfKey("_id", reqData.body.contactFormId) < 0)){
                    serviceResult.status = false;
                    serviceResult.errorCode = ErrorCodes.notFound;
                    serviceResult.statusCode = StatusCodes.notFound;
                }

                if (!serviceResult.status) {
                    reply.status(serviceResult.statusCode).send(serviceResult)
                }
            }
        });
    }
};