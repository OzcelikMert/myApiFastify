import {FastifyRequest, FastifyReply} from 'fastify';
import {Result} from "../library/api";
import subscriberService from "../services/subscriber.service";
import logMiddleware from "../middlewares/log.middleware";
import {
    SubscriberSchemaDeleteDocument, SubscriberSchemaDeleteManyDocument,
    SubscriberSchemaGetDocument,
    SubscriberSchemaGetManyDocument,
    SubscriberSchemaPostDocument
} from "../schemas/subscriber.schema";

const getOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        const reqData = req as SubscriberSchemaGetDocument;

        serviceResult.data = await subscriberService.getOne({
            ...reqData.query
        })

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        const reqData = req as SubscriberSchemaGetManyDocument;

        serviceResult.data = await subscriberService.getMany({
            ...reqData.query
        })

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

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
        let serviceResult = new Result();

        const reqData = req as SubscriberSchemaDeleteDocument;

        serviceResult.data = await subscriberService.deleteOne({
            ...reqData.body
        })

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const deleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

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