import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "@library/api/result";
import {ApiErrorCodes} from "@library/api/errorCodes";
import {ApiStatusCodes} from "@library/api/statusCodes";
import {SubscriberService} from "@services/subscriber.service";
import {LogMiddleware} from "@middlewares/log.middleware";
import {
    ISubscriberDeleteWithIdSchema,
    ISubscriberDeleteManySchema, ISubscriberPostSchema, ISubscriberDeleteWithEmailSchema
} from "@schemas/subscriber.schema";

const checkWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as ISubscriberDeleteWithIdSchema;

        let serviceResult = await SubscriberService.get({
            ...reqData.params
        });

        if(serviceResult){
            req.cachedServiceResult = serviceResult;
        }else {
            apiResult.status = false;
            apiResult.errorCode = ApiErrorCodes.notFound;
            apiResult.statusCode = ApiStatusCodes.notFound;
        }

        if (!apiResult.status) {
            await reply.status(apiResult.statusCode).send(apiResult)
        }
    });
}

const checkMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as ISubscriberDeleteManySchema;

        let serviceResult = await SubscriberService.getMany({
            _id: reqData.body._id
        });

        if (
            serviceResult.length == 0 ||
            (serviceResult.length != reqData.body._id.length)
        ) {
            apiResult.status = false;
            apiResult.errorCode = ApiErrorCodes.alreadyData;
            apiResult.statusCode = ApiStatusCodes.conflict;
        }else {
            req.cachedServiceResult = serviceResult;
        }

        if (!apiResult.status) {
            await reply.status(apiResult.statusCode).send(apiResult)
        }
    });
}

const checkWithEmail = (ifHasGetError?: true) => async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as ISubscriberPostSchema & ISubscriberDeleteWithEmailSchema;

        let serviceResult = await SubscriberService.get({
            ...reqData.body,
            ...reqData.params
        });

        if ((ifHasGetError && serviceResult) || (!ifHasGetError && !serviceResult)) {
            apiResult.status = false;
            apiResult.errorCode = ApiErrorCodes.alreadyData;
            apiResult.statusCode = ApiStatusCodes.conflict;
        }

        if(serviceResult){
            req.cachedServiceResult = serviceResult;
        }

        if (!apiResult.status) {
            await reply.status(apiResult.statusCode).send(apiResult)
        }
    });
}

export const SubscribeMiddleware = {
    checkWithId: checkWithId,
    checkWithEmail: checkWithEmail,
    checkMany: checkMany
};