import { FastifyRequest, FastifyReply } from 'fastify';
import {Result} from "../library/api";
import logMiddleware from "./log.middleware";

export default {
    check: async (req: FastifyRequest, reply: FastifyReply) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            if (!serviceResult.status) {
                reply.status(serviceResult.statusCode).send(serviceResult)
            }
        });
    },
};