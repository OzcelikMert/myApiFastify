import { FastifyRequest, FastifyReply } from 'fastify';
import {ApiResult} from "../library/api/result";
import {ApiErrorCodes} from "../library/api/errorCodes";
import {ApiStatusCodes} from "../library/api/statusCodes";
import {LogMiddleware} from "./log.middleware";
import {LanguageService} from "../services/language.service";
import {ILanguagePutWithIdSchema} from "../schemas/language.schema";

const checkWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as ILanguagePutWithIdSchema;

        let serviceResult = await LanguageService.getOne({_id: reqData.params._id});

        if (!serviceResult) {
            apiResult.status = false;
            apiResult.errorCode = ApiErrorCodes.notFound;
            apiResult.statusCode = ApiStatusCodes.notFound;
        }

        if (!apiResult.status) {
            await reply.status(apiResult.statusCode).send(apiResult)
        }
    });
}

const checkIsDefaultWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as ILanguagePutWithIdSchema;

        let serviceResult = await LanguageService.getOne({isDefault: true});

        if(serviceResult){
            if(reqData.body.isDefault){
                if(serviceResult._id?.toString() != reqData.params._id){
                    await LanguageService.updateIsDefaultMany({isDefault: false});
                }
            }else {
                if(serviceResult._id?.toString() == reqData.params._id){
                    apiResult.status = false;
                    apiResult.errorCode = ApiErrorCodes.emptyValue;
                    apiResult.statusCode = ApiStatusCodes.badRequest;
                }
            }
        }

        if (!apiResult.status) {
            await reply.status(apiResult.statusCode).send(apiResult)
        }
    });
}

export const LanguageMiddleware = {
    checkWithId: checkWithId,
    checkIsDefaultWithId: checkIsDefaultWithId
};