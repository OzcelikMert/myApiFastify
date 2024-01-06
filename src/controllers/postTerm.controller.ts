import { FastifyRequest, FastifyReply } from 'fastify';
import {Result} from "../library/api";
import zod from "zod";
import postTermSchema from "../schemas/postTerm.schema";
import postTermService from "../services/postTerm.service";
import logMiddleware from "../middlewares/log.middleware";

export default {
    getOne: async (
        req: FastifyRequest<{Params: (zod.infer<typeof postTermSchema.get>["params"]), Querystring: (zod.infer<typeof postTermSchema.get>["query"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await postTermService.getOne({
                ...req.params,
                ...req.query
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    getMany: async (
        req: FastifyRequest<{Params: (zod.infer<typeof postTermSchema.getMany>["params"]), Querystring: (zod.infer<typeof postTermSchema.getMany>["query"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await postTermService.getMany({
                ...req.params,
                ...req.query
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    add: async (
        req: FastifyRequest<{Params: (zod.infer<typeof postTermSchema.post>["params"]), Body: (zod.infer<typeof postTermSchema.post>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let insertData = await postTermService.add({
                ...req.body,
                ...req.params,
                lastAuthorId: req.sessionAuth.user?._id.toString(),
                authorId: req.sessionAuth.user?._id.toString(),
            });

            serviceResult.data = {_id: insertData._id};

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    updateOne: async (
        req: FastifyRequest<{Params: (zod.infer<typeof postTermSchema.put>["params"]), Body: (zod.infer<typeof postTermSchema.put>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await postTermService.updateOne({
                ...req.body,
                ...req.params,
                lastAuthorId: req.sessionAuth.user?._id.toString(),
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    updateOneRank: async (
        req: FastifyRequest<{Params: (zod.infer<typeof postTermSchema.putRank>["params"]), Body: (zod.infer<typeof postTermSchema.putRank>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await postTermService.updateOneRank({
                ...req.body,
                ...req.params,
                lastAuthorId: req.sessionAuth.user?._id.toString(),
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    updateManyStatus: async (
        req: FastifyRequest<{Params: (zod.infer<typeof postTermSchema.putManyStatus>["params"]), Body: (zod.infer<typeof postTermSchema.putManyStatus>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await postTermService.updateManyStatus({
                ...req.body,
                ...req.params,
                lastAuthorId: req.sessionAuth.user?._id.toString(),
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    deleteMany: async (
        req: FastifyRequest<{Params: (zod.infer<typeof postTermSchema.deleteMany>["params"]), Body: (zod.infer<typeof postTermSchema.deleteMany>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await postTermService.deleteMany({
                ...req.params,
                ...req.body
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    }
};