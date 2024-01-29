import { FastifyRequest, FastifyReply } from 'fastify';
import {Result} from "../library/api";
import logMiddleware from "./log.middleware";

const check = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        if (!serviceResult.status) {
            reply.status(serviceResult.statusCode).send(serviceResult)
        }
    });
}

export default {
    check: check
};