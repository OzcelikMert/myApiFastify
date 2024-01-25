import { FastifyRequest, FastifyReply } from 'fastify';
import logMiddleware from "../log.middleware";

const set = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        const host = req.headers.host || '';

        req.isFromAdminPanel = host.includes('admin.');
    });
}

export default {
    set: set
};