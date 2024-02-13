import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {
    ISettingGetSchema, ISettingPutContactFormSchema, ISettingPutECommerceSchema,
    ISettingPutGeneralSchema,
    ISettingPutSEOSchema, ISettingPutSocialMediaSchema, ISettingPutStaticLanguageSchema
} from "../schemas/setting.schema";
import {SettingService} from "../services/setting.service";
import {LogMiddleware} from "../middlewares/log.middleware";

const get = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as ISettingGetSchema;

        serviceResult.data = await SettingService.get({
            ...reqData.query
        }, false);

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateGeneral = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as ISettingPutGeneralSchema;

        serviceResult.data = await SettingService.updateGeneral(reqData.body)

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateSEO = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as ISettingPutSEOSchema;

        serviceResult.data = await SettingService.updateSEO(reqData.body)

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateContactForm = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as ISettingPutContactFormSchema;

        serviceResult.data = await SettingService.updateContactForm(reqData.body)

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateStaticLanguage = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as ISettingPutStaticLanguageSchema;

        serviceResult.data = await SettingService.updateStaticLanguage(reqData.body)

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateSocialMedia = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as ISettingPutSocialMediaSchema;

        serviceResult.data = await SettingService.updateSocialMedia(reqData.body)

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateECommerce = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as ISettingPutECommerceSchema;

        serviceResult.data = await SettingService.updateECommerce(reqData.body)

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

export const SettingController = {
    get: get,
    updateGeneral: updateGeneral,
    updateSEO: updateSEO,
    updateContactForm: updateContactForm,
    updateStaticLanguage: updateStaticLanguage,
    updateSocialMedia: updateSocialMedia,
    updateECommerce: updateECommerce
};