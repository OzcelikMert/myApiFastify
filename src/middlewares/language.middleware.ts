import { FastifyRequest, FastifyReply } from 'fastify';
import {ApiResult} from "../library/api/result";
import {ApiErrorCodes} from "../library/api/errorCodes";
import {ApiStatusCodes} from "../library/api/statusCodes";
import logMiddleware from "./log.middleware";
import languageService from "../services/language.service";
import {LanguageSchemaPutOneDocument} from "../schemas/language.schema";

const checkOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as LanguageSchemaPutOneDocument;

        let resData = await languageService.getOne({_id: reqData.params._id});

        if (!resData) {
            serviceResult.status = false;
            serviceResult.errorCode = ApiErrorCodes.notFound;
            serviceResult.statusCode = ApiStatusCodes.notFound;
        }

        if (!serviceResult.status) {
            reply.status(serviceResult.statusCode).send(serviceResult)
        }
    });
}

export default {
    checkOne: checkOne
};