import { FastifyRequest, FastifyReply } from 'fastify';
import {ErrorCodes, Result, StatusCodes} from "../library/api";
import logService from "../services/log.service";

export default {
    error: async (
        req: FastifyRequest,
        reply: FastifyReply,
        func: () => Promise<void>
    ) => {
        try {
            await func();
        }catch (e: any) {
            console.log(e);
            await logService.add({
                url: req.originalUrl,
                ip: req.ip,
                method: req.method,
                message: JSON.stringify({error: e}),
                params: req.params,
                query: req.query,
                body: req.body,
                ...(req.session.data && req.sessionAuth.user?._id ? {userId: req.sessionAuth.user?._id} : {})
            });
            let serviceResult = new Result();
            serviceResult.statusCode = StatusCodes.badRequest;
            serviceResult.errorCode = ErrorCodes.incorrectData;
            serviceResult.status = false;
            reply.status(serviceResult.statusCode).send(serviceResult)
        }
    }
}