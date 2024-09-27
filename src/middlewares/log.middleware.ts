import { FastifyRequest, FastifyReply } from 'fastify';
import {ApiResult} from "@library/api/result";
import {ApiErrorCodes} from "@library/api/errorCodes";
import {ApiStatusCodes} from "@library/api/statusCodes";
import {LogService} from "@services/log.service";

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
            params: JSON.stringify(req.params),
            query: JSON.stringify(req.query),
            body: JSON.stringify(req.body),
            ...(req.sessionAuth && req.sessionAuth.user && req.sessionAuth.user.userId ? {userId: req.sessionAuth.user.userId} : {})
        });
        let apiResult = new ApiResult();
        apiResult.setStatusCode = ApiStatusCodes.badRequest;
        apiResult.setErrorCode = ApiErrorCodes.incorrectData;
        apiResult.status = false;
        await reply.status(apiResult.getStatusCode).send(apiResult)
    }
}

export const LogMiddleware = {
    error: error
}