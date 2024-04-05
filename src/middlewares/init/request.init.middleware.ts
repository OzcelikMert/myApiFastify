import { FastifyRequest, FastifyReply } from 'fastify';
import {LogMiddleware} from "@middlewares/log.middleware";

const set = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        const requestURL = req.headers.origin || '';

        req.isFromAdminPanel = requestURL.includes('admin.') || requestURL.includes('localhost:3001');
    });
}

export const RequestInitMiddleware = {
    set: set
};