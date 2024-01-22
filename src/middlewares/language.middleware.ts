import { FastifyRequest, FastifyReply } from 'fastify';
import {ErrorCodes, Result, StatusCodes} from "../library/api";
import logMiddleware from "./log.middleware";
import languageService from "../services/language.service";
import {LanguageSchemaPutDocument} from "../schemas/language.schema";

export default {
    checkOne: async (req: FastifyRequest, reply: FastifyReply) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let reqData = req as LanguageSchemaPutDocument;

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
};