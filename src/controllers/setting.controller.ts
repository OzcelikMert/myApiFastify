import { FastifyRequest, FastifyReply } from 'fastify';
import {Result} from "../library/api";
import zod from "zod";
import settingSchema from "../schemas/setting.schema";
import settingService from "../services/setting.service";
import logMiddleware from "../middlewares/log.middleware";

export default {
    get: async (
        req: FastifyRequest<{Querystring: (zod.infer<typeof settingSchema.get>["query"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();
            
            serviceResult.data = await settingService.get({
                ...req.query
            }, false);

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    setGeneral: async (
        req: FastifyRequest<{Body: (zod.infer<typeof settingSchema.putGeneral>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await settingService.updateGeneral(req.body)

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    setSeo: async (
        req: FastifyRequest<{Body: (zod.infer<typeof settingSchema.putSeo>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await settingService.updateSEO(req.body)

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    setContactForm: async (
        req: FastifyRequest<{Body: (zod.infer<typeof settingSchema.putContactForm>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await settingService.updateContactForm(req.body)

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    setStaticLanguage: async (
        req: FastifyRequest<{Body: (zod.infer<typeof settingSchema.putStaticLanguage>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await settingService.updateStaticLanguage(req.body)

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    setSocialMedia: async (
        req: FastifyRequest<{Body: (zod.infer<typeof settingSchema.putSocialMedia>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await settingService.updateSocialMedia(req.body)

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    setECommerce: async (
        req: FastifyRequest<{Body: (zod.infer<typeof settingSchema.putECommerce>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await settingService.updateECommerce(req.body)

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
};