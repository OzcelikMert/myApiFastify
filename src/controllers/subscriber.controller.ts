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

const getWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as ISubscriberGetWithIdSchema;

        serviceResult.data = await SubscriberService.getOne({
            ...reqData.params
        })

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as ISubscriberGetManySchema;

        serviceResult.data = await SubscriberService.getMany({
            ...reqData.query
        })

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getWithEmail = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as ISubscriberGetWithEmailSchema;

        serviceResult.data = await SubscriberService.getOne({
            ...reqData.params
        })

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as ISubscriberPostSchema;

        let insertData = await SubscriberService.add({
            ...reqData.body
        });

        serviceResult.data = {_id: insertData._id};

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const deleteWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as ISubscriberDeleteWithIdSchema;

        serviceResult.data = await SubscriberService.deleteOne({
            ...reqData.params
        })

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const deleteWithEmail = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as ISubscriberDeleteWithEmailSchema;

        serviceResult.data = await SubscriberService.deleteOne({
            ...reqData.params
        })

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const deleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as ISubscriberDeleteManySchema;

        serviceResult.data = await SubscriberService.deleteMany({
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