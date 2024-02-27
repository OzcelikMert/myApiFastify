import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {
    ISettingGetSchema, ISettingPutContactFormSchema, ISettingPutECommerceSchema,
    ISettingPutGeneralSchema,
    ISettingPutSEOSchema, ISettingPutSocialMediaSchema, ISettingPutStaticContentSchema
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

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateGeneral = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as ISettingPutGeneralSchema;

        serviceResult.data = await SettingService.updateGeneral(reqData.body)

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateSEO = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as ISettingPutSEOSchema;

        serviceResult.data = await SettingService.updateSEO(reqData.body)

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateContactForm = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as ISettingPutContactFormSchema;

        serviceResult.data = await SettingService.updateContactForm(reqData.body)

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateStaticContent = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as ISettingPutStaticContentSchema;

        serviceResult.data = await SettingService.updateStaticContent(reqData.body)

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateSocialMedia = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as ISettingPutSocialMediaSchema;

        serviceResult.data = await SettingService.updateSocialMedia(reqData.body)

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateECommerce = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as ISettingPutECommerceSchema;

        serviceResult.data = await SettingService.updateECommerce(reqData.body)

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

export const SettingController = {
    get: get,
    updateGeneral: updateGeneral,
    updateSEO: updateSEO,
    updateContactForm: updateContactForm,
    updateStaticContent: updateStaticContent,
    updateSocialMedia: updateSocialMedia,
    updateECommerce: updateECommerce
};