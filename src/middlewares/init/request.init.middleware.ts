import { FastifyRequest, FastifyReply } from 'fastify';
import {LogMiddleware} from "../log.middleware";

const set = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        const host = req.headers.host || '';

        req.isFromAdminPanel = host.includes('admin.');
    });
}

export const RequestInitMiddleware = {
    set: set
};