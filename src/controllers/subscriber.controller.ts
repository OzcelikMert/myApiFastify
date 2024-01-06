import { FastifyRequest, FastifyReply } from 'fastify';
import {Result} from "../library/api";
import zod from "zod";
import subscriberSchema from "../schemas/subscriber.schema";
import subscriberService from "../services/subscriber.service";
import logMiddleware from "../middlewares/log.middleware";

export default {
    getOne: async (
        req: FastifyRequest<{Querystring: (zod.infer<typeof subscriberSchema.get>["query"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await subscriberService.getOne({
                ...req.query
            })

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    getMany: async (
        req: FastifyRequest<{Querystring: (zod.infer<typeof subscriberSchema.getMany>["query"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await subscriberService.getMany({
                ...req.query
            })

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    add: async (
        req: FastifyRequest<{Body: (zod.infer<typeof subscriberSchema.post>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let insertData = await subscriberService.add({
                ...req.body
            });

            serviceResult.data = {_id: insertData._id};

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    deleteOne: async (
        req: FastifyRequest<{Body: (zod.infer<typeof subscriberSchema.delete>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await subscriberService.deleteOne({
                ...req.body
            })

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    deleteMany: async (
        req: FastifyRequest<{Body: (zod.infer<typeof subscriberSchema.deleteMany>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await subscriberService.deleteMany({
                ...req.body
            })

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    }
};