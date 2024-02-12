import { FastifyRequest, FastifyReply } from 'fastify';
import {ApiResult} from "../library/api/result";
import {
    LanguageSchemaGetOneDocument,
    LanguageSchemaGetManyDocument,
    LanguageSchemaPostDocument, LanguageSchemaPutOneDocument, LanguageSchemaPutOneRankDocument
} from "../schemas/language.schema";
import {LanguageService} from "../services/language.service";
import {LogMiddleware} from "../middlewares/log.middleware";
import fs from "fs";
import {Config} from "../config";
import path from "path";

const getOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as LanguageSchemaGetOneDocument;

        serviceResult.data = await LanguageService.getOne({
            ...reqData.params,
            ...reqData.query,
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as LanguageSchemaGetManyDocument;

        serviceResult.data = await LanguageService.getMany({
            ...reqData.query
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getFlags = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const fileType = [".jpg", ".png", ".webp", ".gif", ".jpeg"];

        await new Promise(resolve => {
            fs.readdir(Config.paths.uploads.flags, (err, images) => {
                for(let i=0; i < images.length; i++) {
                    let image = images[i];
                    if(fs.existsSync(path.resolve(Config.paths.uploads.flags, image))) {
                        if (fileType.includes(path.extname(image))){
                            serviceResult.data.push(image)
                        }
                    }
                }
                resolve(0)
            });
        })

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as LanguageSchemaPostDocument;

        let insertData = await LanguageService.add({
            ...reqData.body,
        });

        serviceResult.data = {_id: insertData._id};

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as LanguageSchemaPutOneDocument;

        serviceResult.data = await LanguageService.updateOne({
            ...reqData.params,
            ...reqData.body,
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateOneRank = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as LanguageSchemaPutOneRankDocument;

        serviceResult.data = await LanguageService.updateOneRank({
            ...reqData.params,
            ...reqData.body,
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

export const LanguageController = {
    getOne: getOne,
    getMany: getMany,
    getFlags: getFlags,
    add: add,
    updateOne: updateOne,
    updateOneRank: updateOneRank,
};