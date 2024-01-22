import { FastifyRequest, FastifyReply } from 'fastify';
import {ErrorCodes, Result, StatusCodes} from "../library/api";
import subscriberService from "../services/subscriber.service";
import logMiddleware from "./log.middleware";
import {
    SubscriberSchemaDeleteDocument,
    SubscriberSchemaDeleteManyDocument
} from "../schemas/subscriber.schema";

export default {
    checkOne: (isThere: boolean) => async (req: FastifyRequest, reply: FastifyReply) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let reqData = req as SubscriberSchemaDeleteDocument;

            let resData = await subscriberService.getOne({
                _id: reqData.params._id,
                email: reqData.body.email
            });

            if ((isThere && resData)  || (!isThere && !resData)) {
                serviceResult.status = false;
                serviceResult.errorCode = ErrorCodes.alreadyData;
                serviceResult.statusCode = StatusCodes.conflict;
            }

            if (!serviceResult.status) {
                reply.status(serviceResult.statusCode).send(serviceResult)
            }
        });
    },
    checkMany: async (req: FastifyRequest, reply: FastifyReply) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let reqData = req as SubscriberSchemaDeleteManyDocument;

            let resData = await subscriberService.getMany({
                _id: reqData.body._id
            });

            if (
                resData.length == 0 ||
                (resData.length != reqData.body._id.length)
            ) {
                serviceResult.status = false;
                serviceResult.errorCode = ErrorCodes.alreadyData;
                serviceResult.statusCode = StatusCodes.conflict;
            }

            if (!serviceResult.status) {
                reply.status(serviceResult.statusCode).send(serviceResult)
            }
        });
    }
};