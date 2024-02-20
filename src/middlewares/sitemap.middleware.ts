import { FastifyRequest, FastifyReply } from 'fastify';
import {ApiResult} from "../library/api/result";
import {LogMiddleware} from "./log.middleware";

const check = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        if (!serviceResult.status) {
            await reply.status(serviceResult.statusCode).send(serviceResult)
        }
    });
}

export const SitemapMiddleware = {
    check: check,
};