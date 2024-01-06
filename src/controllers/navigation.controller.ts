import { FastifyRequest, FastifyReply } from 'fastify';
import {Result} from "../library/api";
import zod from "zod";
import logMiddleware from "../middlewares/log.middleware";
import navigationSchema from "../schemas/navigation.schema";
import navigationService from "../services/navigation.service";

export default {
    getOne: async (
        req: FastifyRequest<{Params: (zod.infer<typeof navigationSchema.get>["params"]), Querystring: (zod.infer<typeof navigationSchema.get>["query"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await navigationService.getOne({
                ...req.params,
                ...req.query
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        })
    },
    getMany: async (
        req: FastifyRequest<{Querystring: (zod.infer<typeof navigationSchema.getMany>["query"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await navigationService.getMany({
                ...req.query
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        })
    },
    add: async (
        req: FastifyRequest<{Body: (zod.infer<typeof navigationSchema.post>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let insertData = await navigationService.add({
                ...req.body,
                authorId: req.sessionAuth.user?._id.toString(),
                lastAuthorId: req.sessionAuth.user?._id.toString(),
            });

            serviceResult.data = {_id: insertData._id};

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    updateOne: async (
        req: FastifyRequest<{Params: (zod.infer<typeof navigationSchema.put>["params"]), Body: (zod.infer<typeof navigationSchema.put>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await navigationService.updateOne({
                ...req.params,
                ...req.body,
                lastAuthorId: req.sessionAuth.user?._id.toString(),
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    updateOneRank: async (
        req: FastifyRequest<{Params: (zod.infer<typeof navigationSchema.putRank>["params"]), Body: (zod.infer<typeof navigationSchema.putRank>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await navigationService.updateOneRank({
                ...req.params,
                ...req.body,
                lastAuthorId: req.sessionAuth.user?._id.toString(),
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    updateManyStatus: async (
        req: FastifyRequest<{Body: (zod.infer<typeof navigationSchema.putManyStatus>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await navigationService.updateManyStatus({
                ...req.body,
                lastAuthorId: req.sessionAuth.user?._id.toString()
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    deleteMany: async (
        req: FastifyRequest<{Body: (zod.infer<typeof navigationSchema.deleteMany>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await navigationService.deleteMany({
                ...req.body
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    }
};