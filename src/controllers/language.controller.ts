import { FastifyRequest, FastifyReply } from 'fastify';
import {Result} from "../library/api";
import zod from "zod";
import languageSchema from "../schemas/language.schema";
import languageService from "../services/language.service";
import logMiddleware from "../middlewares/log.middleware";
import fs from "fs";
import {Config} from "../config";
import path from "path";

export default {
    getOne: async (
        req: FastifyRequest<{Params: (zod.infer<typeof languageSchema.get>["params"]), Querystring: (zod.infer<typeof languageSchema.get>["query"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await languageService.getOne({
                ...req.params,
                ...req.query,
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    getMany: async (
        req: FastifyRequest<{Querystring: (zod.infer<typeof languageSchema.getMany>["query"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await languageService.getMany({
                ...req.query
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    getFlags: async (
        req: FastifyRequest,
        reply: FastifyReply
    ) => {
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
    },
    add: async (
        req: FastifyRequest<{Body: (zod.infer<typeof languageSchema.post>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let insertData = await languageService.add({
                ...req.body,
            });

            serviceResult.data = {_id: insertData._id};

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    updateOne: async (
        req: FastifyRequest<{Params: (zod.infer<typeof languageSchema.put>["params"]), Body: (zod.infer<typeof languageSchema.put>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await languageService.updateOne({
                ...req.params,
                ...req.body,
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    updateOneRank: async (
        req: FastifyRequest<{Params: (zod.infer<typeof languageSchema.putRank>["params"]), Body: (zod.infer<typeof languageSchema.putRank>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await languageService.updateOneRank({
                ...req.params,
                ...req.body,
            });

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
};