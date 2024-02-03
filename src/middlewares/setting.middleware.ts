import { FastifyRequest, FastifyReply } from 'fastify';
import {ApiResult} from "../library/api/result";
import logMiddleware from "./log.middleware";

const check = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        if (!serviceResult.status) {
            reply.status(serviceResult.statusCode).send(serviceResult)
        }
    });
}

export default {
    check: check
};