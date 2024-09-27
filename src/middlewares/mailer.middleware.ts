import { FastifyRequest, FastifyReply } from 'fastify';
import {ApiResult} from "@library/api/result";
import {ApiErrorCodes} from "@library/api/errorCodes";
import {ApiStatusCodes} from "@library/api/statusCodes";
import {SettingService} from "@services/setting.service";
import {LogMiddleware} from "@middlewares/log.middleware";
import {IMailerPostSchema} from "@schemas/mailer.schema";

const checkContactForm = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IMailerPostSchema;

        let setting = (await SettingService.get({}));

        if(setting){
            if((typeof setting.contactForms === "undefined") || (setting.contactForms && setting.contactForms?.indexOfKey("_id", reqData.body.contactFormId) < 0)){
                apiResult.status = false;
                apiResult.setErrorCode = ApiErrorCodes.notFound;
                apiResult.setStatusCode = ApiStatusCodes.notFound;
            }

            if (!apiResult.status) {
                await reply.status(apiResult.getStatusCode).send(apiResult)
            }
        }
    });
}

export const MailerMiddleware = {
    checkContactForm: checkContactForm
};