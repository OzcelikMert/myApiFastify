import { FastifyRequest, FastifyReply } from 'fastify';
import {ApiResult} from "@library/api/result";
import {ApiErrorCodes} from "@library/api/errorCodes";
import {ApiStatusCodes} from "@library/api/statusCodes";
import {LogMiddleware} from "@middlewares/log.middleware";
import {NavigationService} from "@services/navigation.service";
import {INavigationPutStatusManySchema, INavigationPutWithIdSchema} from "@schemas/navigation.schema";

const checkWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as INavigationPutWithIdSchema;

        let serviceResult = await NavigationService.get({_id: reqData.params._id});

        if (!serviceResult) {
            apiResult.status = false;
            apiResult.setErrorCode = ApiErrorCodes.notFound;
            apiResult.setStatusCode = ApiStatusCodes.notFound;
        }else {
            req.cachedServiceResult = serviceResult;
        }

        if (!apiResult.status) {
            await reply.status(apiResult.getStatusCode).send(apiResult)
        }
    });
}

const checkMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as INavigationPutStatusManySchema;

        let serviceResult = await NavigationService.getMany({_id: reqData.body._id});

        if (
            serviceResult.length == 0 ||
            (serviceResult.length !=  reqData.body._id.length)
        ) {
            apiResult.status = false;
            apiResult.setErrorCode = ApiErrorCodes.notFound;
            apiResult.setStatusCode = ApiStatusCodes.notFound;
        }else {
            req.cachedServiceResult = serviceResult;
        }

        if (!apiResult.status) {
            await reply.status(apiResult.getStatusCode).send(apiResult)
        }
    });
}

export const NavigationMiddleware = {
    checkWithId: checkWithId,
    checkMany: checkMany
};