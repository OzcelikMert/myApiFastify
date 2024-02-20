import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {SubscriberService} from "../services/subscriber.service";
import {LogMiddleware} from "../middlewares/log.middleware";
import {
    ISubscriberDeleteOneSchema, ISubscriberDeleteManySchema,
    ISubscriberGetOneSchema,
    ISubscriberGetManySchema,
    ISubscriberPostSchema, ISubscriberDeleteOneWithEmailSchema, ISubscriberGetOneWithEmailSchema
} from "../schemas/subscriber.schema";

const getOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as ISubscriberGetOneSchema;

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

const getOneWithEmail = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as ISubscriberGetOneWithEmailSchema;

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

const deleteOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as ISubscriberDeleteOneSchema;

        serviceResult.data = await SubscriberService.deleteOne({
            ...reqData.params
        })

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const deleteOneWithEmail = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as ISubscriberDeleteOneWithEmailSchema;

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
    getOne: getOne,
    getMany: getMany,
    getOneWithEmail: getOneWithEmail,
    add: add,
    deleteOne: deleteOne,
    deleteOneWithEmail: deleteOneWithEmail,
    deleteMany: deleteMany
};