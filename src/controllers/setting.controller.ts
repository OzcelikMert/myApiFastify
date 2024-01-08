import { FastifyRequest, FastifyReply } from 'fastify';
import {Result} from "../library/api";
import {
    SettingSchemaGetDocument, SettingSchemaPutContactFormDocument, SettingSchemaPutECommerceDocument,
    SettingSchemaPutGeneralDocument,
    SettingSchemaPutSEODocument, SettingSchemaPutSocialMediaDocument, SettingSchemaPutStaticLanguageDocument
} from "../schemas/setting.schema";
import settingService from "../services/setting.service";
import logMiddleware from "../middlewares/log.middleware";

export default {
    get: async (req: FastifyRequest, reply: FastifyReply) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let reqData = req as SettingSchemaGetDocument;

            serviceResult.data = await settingService.get({
                ...reqData.query
            }, false);

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    updateGeneral: async (req: FastifyRequest, reply: FastifyReply) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let reqData = req as SettingSchemaPutGeneralDocument;

            serviceResult.data = await settingService.updateGeneral(reqData.body)

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    updateSEO: async (req: FastifyRequest, reply: FastifyReply) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let reqData = req as SettingSchemaPutSEODocument;

            serviceResult.data = await settingService.updateSEO(reqData.body)

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    updateContactForm: async (req: FastifyRequest, reply: FastifyReply) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let reqData = req as SettingSchemaPutContactFormDocument;

            serviceResult.data = await settingService.updateContactForm(reqData.body)

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    updateStaticLanguage: async (req: FastifyRequest, reply: FastifyReply) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let reqData = req as SettingSchemaPutStaticLanguageDocument;

            serviceResult.data = await settingService.updateStaticLanguage(reqData.body)

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    updateSocialMedia: async (req: FastifyRequest, reply: FastifyReply) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let reqData = req as SettingSchemaPutSocialMediaDocument;

            serviceResult.data = await settingService.updateSocialMedia(reqData.body)

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    updateECommerce: async (req: FastifyRequest, reply: FastifyReply) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let reqData = req as SettingSchemaPutECommerceDocument;

            serviceResult.data = await settingService.updateECommerce(reqData.body)

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    }
};