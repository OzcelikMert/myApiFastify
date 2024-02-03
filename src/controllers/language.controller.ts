import { FastifyRequest, FastifyReply } from 'fastify';
import {Result} from "../library/api";
import {
    LanguageSchemaGetOneDocument,
    LanguageSchemaGetManyDocument,
    LanguageSchemaPostDocument, LanguageSchemaPutOneDocument, LanguageSchemaPutOneRankDocument
} from "../schemas/language.schema";
import languageService from "../services/language.service";
import logMiddleware from "../middlewares/log.middleware";
import fs from "fs";
import {Config} from "../config";
import path from "path";

const getOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as LanguageSchemaGetOneDocument;

        serviceResult.data = await languageService.getOne({
            ...reqData.params,
            ...reqData.query,
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as LanguageSchemaGetManyDocument;

        serviceResult.data = await languageService.getMany({
            ...reqData.query
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getFlags = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

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
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as LanguageSchemaPostDocument;

        let insertData = await languageService.add({
            ...reqData.body,
        });

        serviceResult.data = {_id: insertData._id};

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as LanguageSchemaPutOneDocument;

        serviceResult.data = await languageService.updateOne({
            ...reqData.params,
            ...reqData.body,
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateOneRank = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let reqData = req as LanguageSchemaPutOneRankDocument;

        serviceResult.data = await languageService.updateOneRank({
            ...reqData.params,
            ...reqData.body,
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

export default {
    getOne: getOne,
    getMany: getMany,
    getFlags: getFlags,
    add: add,
    updateOne: updateOne,
    updateOneRank: updateOneRank,
};