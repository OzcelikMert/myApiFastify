import { FastifyRequest, FastifyReply } from 'fastify';
import {ErrorCodes, Result, StatusCodes} from "../library/api";
import logMiddleware from "./log.middleware";
import languageService from "../services/language.service";
import {LanguageSchemaPutOneDocument} from "../schemas/language.schema";

const checkOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as LanguageSchemaPutOneDocument;

        let resData = await languageService.getOne({_id: reqData.params._id});

        if (!resData) {
            serviceResult.status = false;
            serviceResult.errorCode = ErrorCodes.notFound;
            serviceResult.statusCode = StatusCodes.notFound;
        }

        if (!serviceResult.status) {
            reply.status(serviceResult.statusCode).send(serviceResult)
        }
    });
}

export default {
    checkOne: checkOne
};