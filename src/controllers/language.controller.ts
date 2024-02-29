import { FastifyRequest, FastifyReply } from 'fastify';
import {ApiResult} from "../library/api/result";
import {
    ILanguageGetWithIdSchema,
    ILanguageGetManySchema,
    ILanguagePostSchema, ILanguagePutWithIdSchema, ILanguagePutWithIdRankSchema
} from "../schemas/language.schema";
import {LanguageService} from "../services/language.service";
import {LogMiddleware} from "../middlewares/log.middleware";
import fs from "fs";
import {Config} from "../config";
import path from "path";
import {ILanguageGetResultService} from "../types/services/language.service";
import {ILanguageModel} from "../types/models/language.model";

const getWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<ILanguageGetResultService>();

        let reqData = req as ILanguageGetWithIdSchema;

        serviceResult.data = await LanguageService.getOne({
            ...reqData.params,
            ...reqData.query,
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<ILanguageGetResultService[]>();

        let reqData = req as ILanguageGetManySchema;

        serviceResult.data = await LanguageService.getMany({
            ...reqData.query
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getFlags = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<string[]>();
        serviceResult.data = [];

        const fileType = [".jpg", ".png", ".webp", ".gif", ".jpeg"];

        await new Promise(resolve => {
            fs.readdir(Config.paths.uploads.flags, (err, images) => {
                for(let i=0; i < images.length; i++) {
                    let image = images[i];
                    if(fs.existsSync(path.resolve(Config.paths.uploads.flags, image))) {
                        if (fileType.includes(path.extname(image))){
                            serviceResult.data?.push(image)
                        }
                    }
                }
                resolve(0)
            });
        })

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<ILanguageModel>();

        let reqData = req as ILanguagePostSchema;

        serviceResult.data = await LanguageService.add({
            ...reqData.body,
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as ILanguagePutWithIdSchema;

        await LanguageService.updateOne({
            ...reqData.params,
            ...reqData.body,
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateWithIdRank = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as ILanguagePutWithIdRankSchema;

        await LanguageService.updateOneRank({
            ...reqData.params,
            ...reqData.body,
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

export const LanguageController = {
    getWithId: getWithId,
    getMany: getMany,
    getFlags: getFlags,
    add: add,
    updateWithId: updateWithId,
    updateWithIdRank: updateWithIdRank,
};