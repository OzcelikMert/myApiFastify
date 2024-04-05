import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "@library/api/result";
import {ApiErrorCodes} from "@library/api/errorCodes";
import {ApiStatusCodes} from "@library/api/statusCodes";
import {SubscriberService} from "@services/subscriber.service";
import {LogMiddleware} from "@middlewares/log.middleware";
import {
    ISubscriberDeleteWithIdSchema,
    ISubscriberDeleteManySchema
} from "@schemas/subscriber.schema";

const checkWithId = (isThere: boolean) => async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as ISubscriberDeleteWithIdSchema;

        let serviceResult = await SubscriberService.get({
            ...reqData.params
        });

        if ((isThere && serviceResult) || (!isThere && !serviceResult)) {
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

export const SubscribeMiddleware = {
    checkWithId: checkWithId,
    checkMany: checkMany
};