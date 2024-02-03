import { FastifyRequest, FastifyReply } from 'fastify';
import {ApiResult} from "../library/api/result";
import {ApiErrorCodes} from "../library/api/errorCodes";
import {ApiStatusCodes} from "../library/api/statusCodes";
import settingService from "../services/setting.service";
import logMiddleware from "./log.middleware";
import {MailerSchemaPostDocument} from "../schemas/mailer.schema";

const checkContactForm = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as MailerSchemaPostDocument;

        let setting = (await settingService.get({}));

        if(setting){
            if((typeof setting.contactForms === "undefined") || (setting.contactForms && setting.contactForms?.indexOfKey("_id", reqData.body.contactFormId) < 0)){
                serviceResult.status = false;
                serviceResult.errorCode = ApiErrorCodes.notFound;
                serviceResult.statusCode = ApiStatusCodes.notFound;
            }

            if (!serviceResult.status) {
                reply.status(serviceResult.statusCode).send(serviceResult)
            }
        }
    });
}

export default {
    checkContactForm: checkContactForm
};