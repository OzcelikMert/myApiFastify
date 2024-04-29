import { FastifyRequest, FastifyReply } from 'fastify';
import {ApiResult} from "@library/api/result";
import {ApiErrorCodes} from "@library/api/errorCodes";
import {ApiStatusCodes} from "@library/api/statusCodes";
import {LogMiddleware} from "@middlewares/log.middleware";
import {LanguageService} from "@services/language.service";
import {ILanguagePutWithIdSchema} from "@schemas/language.schema";
import {ILanguageModel} from "types/models/language.model";

const checkWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as ILanguagePutWithIdSchema;

        let serviceResult = await LanguageService.get({_id: reqData.params._id});

        if (!serviceResult) {
            apiResult.status = false;
            apiResult.errorCode = ApiErrorCodes.notFound;
            apiResult.statusCode = ApiStatusCodes.notFound;
        }else {
            req.cachedServiceResult = serviceResult;
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

        let serviceResult = req.cachedServiceResult as ILanguageModel;

        if(!serviceResult.isDefault && reqData.body.isDefault){
            await LanguageService.updateIsDefaultMany({isDefault: false});
        }else if (serviceResult.isDefault && !reqData.body.isDefault) {
            apiResult.status = false;
            apiResult.errorCode = ApiErrorCodes.emptyValue;
            apiResult.statusCode = ApiStatusCodes.badRequest;
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