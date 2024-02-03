import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {ApiErrorCodes} from "../library/api/errorCodes";
import {ApiStatusCodes} from "../library/api/statusCodes";
import subscriberService from "../services/subscriber.service";
import logMiddleware from "./log.middleware";
import {
    SubscriberSchemaDeleteOneDocument,
    SubscriberSchemaDeleteManyDocument
} from "../schemas/subscriber.schema";

const checkOne = (isThere: boolean) => async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as SubscriberSchemaDeleteOneDocument;

        let resData = await subscriberService.getOne({
            _id: reqData.params._id,
            email: reqData.body.email
        });

        if ((isThere && resData) || (!isThere && !resData)) {
            serviceResult.status = false;
            serviceResult.errorCode = ApiErrorCodes.alreadyData;
            serviceResult.statusCode = ApiStatusCodes.conflict;
        }

        if (!serviceResult.status) {
            reply.status(serviceResult.statusCode).send(serviceResult)
        }
    });
}

const checkMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as SubscriberSchemaDeleteManyDocument;

        let resData = await subscriberService.getMany({
            _id: reqData.body._id
        });

        if (
            resData.length == 0 ||
            (resData.length != reqData.body._id.length)
        ) {
            serviceResult.status = false;
            serviceResult.errorCode = ApiErrorCodes.alreadyData;
            serviceResult.statusCode = ApiStatusCodes.conflict;
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