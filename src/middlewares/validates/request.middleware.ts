import { FastifyRequest, FastifyReply } from 'fastify';
import {ApiResult} from "../../library/api/result";
import {ApiErrorCodes} from "../../library/api/errorCodes";
import {ApiStatusCodes} from "../../library/api/statusCodes";
import {ZodSchema} from "zod";

const check = (schema: ZodSchema) => async (
    req: FastifyRequest,
    reply: FastifyReply
) => {
    let serviceResult = new ApiResult();
    try {
        let validatedData = await schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        req = Object.assign(req, validatedData);
    } catch (e: any) {
        serviceResult.status = false;
        serviceResult.data = [];
        serviceResult.message = e.errors;
        serviceResult.errorCode = ApiErrorCodes.incorrectData;
        serviceResult.statusCode = ApiStatusCodes.badRequest;
    } finally {
        if (!serviceResult.status) {
            reply.status(serviceResult.statusCode).send(serviceResult)
        }
    }
}

export const RequestMiddleware = {
    check: check
};
