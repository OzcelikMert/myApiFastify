import { FastifyRequest, FastifyReply } from 'fastify';
import {ApiResult} from "../library/api/result";
import {ApiErrorCodes} from "../library/api/errorCodes";
import {ApiStatusCodes} from "../library/api/statusCodes";
import {ComponentService} from "../services/component.service";
import {LogMiddleware} from "./log.middleware";
import {IComponentDeleteManySchema, IComponentPutWithIdSchema} from "../schemas/component.schema";

const checkWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IComponentPutWithIdSchema;

        let resData = await ComponentService.getOne({_id: reqData.params._id});

        if (!resData) {
            serviceResult.status = false;
            serviceResult.errorCode = ApiErrorCodes.notFound;
            serviceResult.statusCode = ApiStatusCodes.notFound;
        }

        if (!serviceResult.status) {
            await reply.status(serviceResult.statusCode).send(serviceResult)
        }
    });
}

const checkMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IComponentDeleteManySchema;

        let resData = await ComponentService.getMany({_id: reqData.body._id});

        if (
            resData.length == 0 ||
            (resData.length != reqData.body._id.length)
        ) {
            serviceResult.status = false;
            serviceResult.errorCode = ApiErrorCodes.notFound;
            serviceResult.statusCode = ApiStatusCodes.notFound;
        }

        if (!serviceResult.status) {
            await reply.status(serviceResult.statusCode).send(serviceResult)
        }
    });
}

export const ComponentMiddleware = {
    checkWithId: checkWithId,
    checkMany: checkMany
};