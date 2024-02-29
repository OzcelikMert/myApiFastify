import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {SubscriberService} from "../services/subscriber.service";
import {LogMiddleware} from "../middlewares/log.middleware";
import {
    ISubscriberDeleteWithIdSchema, ISubscriberDeleteManySchema,
    ISubscriberGetWithIdSchema,
    ISubscriberGetManySchema,
    ISubscriberPostSchema, ISubscriberDeleteWithEmailSchema, ISubscriberGetWithEmailSchema
} from "../schemas/subscriber.schema";
import {ISubscriberGetResultService} from "../types/services/subscriber.service";
import {ISubscriberModel} from "../types/models/subscriber.model";

const getWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<ISubscriberGetResultService>();

        const reqData = req as ISubscriberGetWithIdSchema;

        serviceResult.data = await SubscriberService.getOne({
            ...reqData.params
        })

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<ISubscriberGetResultService[]>();

        const reqData = req as ISubscriberGetManySchema;

        serviceResult.data = await SubscriberService.getMany({
            ...reqData.query
        })

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getWithEmail = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<ISubscriberGetResultService>();

        const reqData = req as ISubscriberGetWithEmailSchema;

        serviceResult.data = await SubscriberService.getOne({
            ...reqData.params
        })

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<ISubscriberModel>();

        const reqData = req as ISubscriberPostSchema;

        serviceResult.data = await SubscriberService.add({
            ...reqData.body
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const deleteWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as ISubscriberDeleteWithIdSchema;

        await SubscriberService.deleteOne({
            ...reqData.params
        })

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const deleteWithEmail = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as ISubscriberDeleteWithEmailSchema;

        await SubscriberService.deleteOne({
            ...reqData.params
        })

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const deleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as ISubscriberDeleteManySchema;

        await SubscriberService.deleteMany({
            ...reqData.body
        })

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

export const SubscriberController = {
    getWithId: getWithId,
    getMany: getMany,
    getWithEmail: getWithEmail,
    add: add,
    deleteWithId: deleteWithId,
    deleteWithEmail: deleteWithEmail,
    deleteMany: deleteMany
};