import { FastifyRequest, FastifyReply } from 'fastify';
import {Result} from "../library/api";
import zod from "zod";
import userSchema from "../schemas/user.schema";
import userService from "../services/user.service";
import logMiddleware from "../middlewares/log.middleware";

export default {
    getOne: async (
        req: FastifyRequest<{Querystring: (zod.infer<typeof userSchema.get>["query"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await userService.getOne({
                ...req.query
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    getMany: async (
        req: FastifyRequest<{Querystring: (zod.infer<typeof userSchema.getMany>["query"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await userService.getMany({
                ...req.query
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    add: async (
        req: FastifyRequest<{Body: (zod.infer<typeof userSchema.post>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let insertData = await userService.add({
                ...req.body,
                ...(req.body.banDateEnd ? {banDateEnd: new Date(req.body.banDateEnd)} : {banDateEnd: undefined})
            });

            serviceResult.data = {_id: insertData._id};

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    updateOne: async (
        req: FastifyRequest<{Params: (zod.infer<typeof userSchema.put>["params"]), Body: (zod.infer<typeof userSchema.put>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await userService.updateOne({
                ...req.params,
                ...req.body,
                ...(req.body.banDateEnd ? {banDateEnd: new Date(req.body.banDateEnd)} : {banDateEnd: undefined})
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    updateProfile: async (
        req: FastifyRequest<{Body: (zod.infer<typeof userSchema.putProfile>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await userService.updateOne({
                ...req.body,
                _id: req.sessionAuth.user?._id.toString(),
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    updatePassword: async (
        req: FastifyRequest<{Body: (zod.infer<typeof userSchema.putPassword>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await userService.updateOne({
                _id: req.sessionAuth.user?._id.toString(),
                password: req.body.newPassword
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    deleteOne: async (
        req: FastifyRequest<{Params: (zod.infer<typeof userSchema.delete>["params"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await userService.deleteOne(req.params);

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    }
};