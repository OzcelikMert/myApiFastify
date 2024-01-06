import { FastifyRequest, FastifyReply } from 'fastify';
import {Result} from "../library/api";
import zod from "zod";
import postSchema from "../schemas/post.schema";
import postService from "../services/post.service";
import logMiddleware from "../middlewares/log.middleware";

export default {
    getOne: async (
        req: FastifyRequest<{Params: (zod.infer<typeof postSchema.get>["params"]), Querystring: (zod.infer<typeof postSchema.get>["query"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await postService.getOne({
                ...req.params,
                ...req.query
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        })
    },
    getMany: async (
        req: FastifyRequest<{Querystring: (zod.infer<typeof postSchema.getMany>["query"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await postService.getMany({
                ...req.query
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        })
    },
    getCount: async (
        req: FastifyRequest<{Params: (zod.infer<typeof postSchema.getCount>["params"]), Querystring: (zod.infer<typeof postSchema.getCount>["query"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await postService.getCount({
                ...req.params,
                ...req.query
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    add: async (
        req: FastifyRequest<{Params: (zod.infer<typeof postSchema.post>["params"]), Body: (zod.infer<typeof postSchema.post>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let insertData = await postService.add({
                ...req.params,
                ...req.body,
                authorId: req.sessionAuth.user?._id.toString(),
                lastAuthorId: req.sessionAuth.user?._id.toString(),
                dateStart: new Date(req.body.dateStart)
            });

            serviceResult.data = {_id: insertData._id};

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    updateOne: async (
        req: FastifyRequest<{Params: (zod.infer<typeof postSchema.put>["params"]), Body: (zod.infer<typeof postSchema.put>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await postService.updateOne({
                ...req.params,
                ...req.body,
                lastAuthorId: req.sessionAuth.user?._id.toString(),
                dateStart: new Date(req.body.dateStart)
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    updateOneRank: async (
        req: FastifyRequest<{Params: (zod.infer<typeof postSchema.putOneRank>["params"]), Body: (zod.infer<typeof postSchema.putOneRank>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await postService.updateOneRank({
                ...req.body,
                ...req.params,
                lastAuthorId: req.sessionAuth.user?._id.toString(),
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    updateOneView: async (
        req: FastifyRequest<{Params: (zod.infer<typeof postSchema.putOneView>["params"]), Body: (zod.infer<typeof postSchema.putOneView>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await postService.updateOneView({
                ...req.params,
                ...req.body
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    updateManyStatus: async (
        req: FastifyRequest<{Params: (zod.infer<typeof postSchema.putManyStatus>["params"]), Body: (zod.infer<typeof postSchema.putManyStatus>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await postService.updateManyStatus({
                ...req.body,
                ...req.params,
                lastAuthorId: req.sessionAuth.user?._id.toString(),
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    deleteMany: async (
        req: FastifyRequest<{Params: (zod.infer<typeof postSchema.deleteMany>["params"]), Body: (zod.infer<typeof postSchema.deleteMany>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await postService.deleteMany({
                ...req.params,
                ...req.body
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    }
};