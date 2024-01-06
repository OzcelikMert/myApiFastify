import { FastifyRequest, FastifyReply } from 'fastify';
import {Result} from "../library/api";
import zod from "zod";
import componentSchema from "../schemas/component.schema";
import componentService from "../services/component.service";
import logMiddleware from "../middlewares/log.middleware";

export default {
    getOne: async (
        req: FastifyRequest<{Params: (zod.infer<typeof componentSchema.get>["params"]), Querystring: (zod.infer<typeof componentSchema.get>["query"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await componentService.getOne({
                ...req.params,
                ...req.query,
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        })
    },
    getMany: async (
        req: FastifyRequest<{Querystring: (zod.infer<typeof componentSchema.getMany>["query"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await componentService.getMany({
                ...req.query
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        })
    },
    add: async (
        req: FastifyRequest<{Body: (zod.infer<typeof componentSchema.post>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let insertData = await componentService.add({
                ...req.body,
                authorId: req.sessionAuth.user?.userId.toString(),
                lastAuthorId: req.sessionAuth.user?.userId.toString()
            });

            serviceResult.data = {_id: insertData._id};

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    updateOne: async (
        req: FastifyRequest<{Params: (zod.infer<typeof componentSchema.put>["params"]), Body: (zod.infer<typeof componentSchema.put>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await componentService.updateOne({
                ...req.params,
                ...req.body,
                lastAuthorId: req.sessionAuth.user?.userId.toString()
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    deleteMany: async (
        req: FastifyRequest<{Body: (zod.infer<typeof componentSchema.deleteMany>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await componentService.deleteMany({
                ...req.body
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    }
};