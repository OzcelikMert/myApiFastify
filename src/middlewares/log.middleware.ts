import { FastifyRequest, FastifyReply } from 'fastify';
import {ApiResult} from "../library/api/result";
import {ApiErrorCodes} from "../library/api/errorCodes";
import {ApiStatusCodes} from "../library/api/statusCodes";
import {LogService} from "../services/log.service";

const error = async (req: FastifyRequest, reply: FastifyReply, func: () => Promise<void>) => {
    try {
        await func();
    }catch (e: any) {
        console.log(e);
        await LogService.add({
            url: req.originalUrl,
            ip: req.ip,
            method: req.method,
            message: JSON.stringify({error: e}),
            params: req.params,
            query: req.query,
            body: req.body,
            ...(req.sessionAuth && req.sessionAuth.user && req.sessionAuth.user.userId ? {userId: req.sessionAuth!.user?.userId} : {})
        });
        let serviceResult = new ApiResult();
        serviceResult.statusCode = ApiStatusCodes.badRequest;
        serviceResult.errorCode = ApiErrorCodes.incorrectData;
        serviceResult.status = false;
        reply.status(serviceResult.statusCode).send(serviceResult)
    }
}

export const LogMiddleware = {
    error: error
}