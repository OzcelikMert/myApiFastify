import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import subscriberService from "../services/subscriber.service";
import logMiddleware from "../middlewares/log.middleware";
import {
    SubscriberSchemaDeleteOneDocument, SubscriberSchemaDeleteManyDocument,
    SubscriberSchemaGetOneDocument,
    SubscriberSchemaGetManyDocument,
    SubscriberSchemaPostDocument
} from "../schemas/subscriber.schema";

const getOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as SubscriberSchemaGetOneDocument;

        serviceResult.data = await subscriberService.getOne({
            ...reqData.query
        })

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as SubscriberSchemaGetManyDocument;

        serviceResult.data = await subscriberService.getMany({
            ...reqData.query
        })

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as SubscriberSchemaPostDocument;

        let insertData = await subscriberService.add({
            ...reqData.body
        });

        serviceResult.data = {_id: insertData._id};

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const deleteOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as SubscriberSchemaDeleteOneDocument;

        serviceResult.data = await subscriberService.deleteOne({
            ...reqData.body
        })

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const deleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as SubscriberSchemaDeleteManyDocument;

        serviceResult.data = await subscriberService.deleteMany({
            ...reqData.body
        })

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

export default {
    getOne: getOne,
    getMany: getMany,
    add: add,
    deleteOne: deleteOne,
    deleteMany: deleteMany
};