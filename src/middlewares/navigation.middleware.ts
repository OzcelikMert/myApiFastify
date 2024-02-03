import { FastifyRequest, FastifyReply } from 'fastify';
import {ErrorCodes, Result, StatusCodes} from "../library/api";
import logMiddleware from "./log.middleware";
import navigationService from "../services/navigation.service";
import {NavigationSchemaPutOneDocument, NavigationSchemaPutManyStatusDocument} from "../schemas/navigation.schema";

const checkOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as NavigationSchemaPutOneDocument;

        let resData = await navigationService.getOne({_id: reqData.params._id});

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

const checkMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as NavigationSchemaPutManyStatusDocument;

        let resData = await navigationService.getMany({_id: reqData.body._id});

        if (
            resData.length == 0 ||
            (resData.length !=  reqData.body._id.length)
        ) {
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
    checkOne: checkOne,
    checkMany: checkMany
};