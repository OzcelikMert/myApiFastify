import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {
    ISettingGetSchema, ISettingPutContactFormSchema, ISettingPutECommerceSchema,
    ISettingPutGeneralSchema,
    ISettingPutSEOSchema, ISettingPutSocialMediaSchema, ISettingPutStaticContentSchema
} from "../schemas/setting.schema";
import {SettingService} from "../services/setting.service";
import {LogMiddleware} from "../middlewares/log.middleware";
import {ISettingGetResultService} from "../types/services/setting.service";

const get = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<ISettingGetResultService>();

        let reqData = req as ISettingGetSchema;

        apiResult.data = await SettingService.get({
            ...reqData.query
        }, false);

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const updateGeneral = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as ISettingPutGeneralSchema;

        await SettingService.updateGeneral(reqData.body)

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const updateSEO = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as ISettingPutSEOSchema;

        await SettingService.updateSEO(reqData.body)

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const updateContactForm = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as ISettingPutContactFormSchema;

        await SettingService.updateContactForm(reqData.body)

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const updateStaticContent = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as ISettingPutStaticContentSchema;

        await SettingService.updateStaticContent(reqData.body)

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const updateSocialMedia = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as ISettingPutSocialMediaSchema;

        await SettingService.updateSocialMedia(reqData.body)

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const updateECommerce = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as ISettingPutECommerceSchema;

        await SettingService.updateECommerce(reqData.body)

        await reply.status(apiResult.statusCode).send(apiResult)
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