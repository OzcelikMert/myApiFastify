import { FastifyRequest, FastifyReply } from 'fastify';
import {ApiResult} from "@library/api/result";
import {
    ILanguageGetWithIdSchema,
    ILanguageGetManySchema,
    ILanguagePostSchema, ILanguagePutWithIdSchema, ILanguagePutRankWithIdSchema, ILanguageGetDefaultSchema
} from "@schemas/language.schema";
import {LanguageService} from "@services/language.service";
import {LogMiddleware} from "@middlewares/log.middleware";
import fs from "fs";
import {Config} from "@configs/index";
import path from "path";
import {ILanguageGetResultService} from "types/services/language.service";
import {ILanguageModel} from "types/models/language.model";

const getWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<ILanguageGetResultService>();

        let reqData = req as ILanguageGetWithIdSchema;

        apiResult.data = await LanguageService.get({
            ...reqData.params
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const getDefault = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<ILanguageGetResultService>();

        let reqData = req as ILanguageGetDefaultSchema;

        apiResult.data = await LanguageService.get({isDefault: true});

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<ILanguageGetResultService[]>();

        let reqData = req as ILanguageGetManySchema;

        apiResult.data = await LanguageService.getMany({
            ...reqData.query
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const getFlags = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<string[]>();
        apiResult.data = [];

        const fileType = [".jpg", ".png", ".webp", ".gif", ".jpeg"];

        await new Promise(resolve => {
            fs.readdir(Config.paths.uploads.flags, (err, images) => {
                for(let i=0; i < images.length; i++) {
                    let image = images[i];
                    if(fs.existsSync(path.resolve(Config.paths.uploads.flags, image))) {
                        if (fileType.includes(path.extname(image))){
                            apiResult.data?.push(image)
                        }
                    }
                }
                resolve(0)
            });
        })

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<ILanguageModel>();

        let reqData = req as ILanguagePostSchema;

        apiResult.data = await LanguageService.add({
            ...reqData.body,
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const updateWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as ILanguagePutWithIdSchema;

        await LanguageService.update({
            ...reqData.params,
            ...reqData.body,
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const updateRankWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as ILanguagePutRankWithIdSchema;

        await LanguageService.updateRank({
            ...reqData.params,
            ...reqData.body,
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

export const LanguageController = {
    getWithId: getWithId,
    getDefault: getDefault,
    getMany: getMany,
    getFlags: getFlags,
    add: add,
    updateWithId: updateWithId,
    updateRankWithId: updateRankWithId,
};