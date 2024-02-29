import { FastifyRequest, FastifyReply } from 'fastify';
import {ApiResult} from "../../library/api/result";
import {ApiErrorCodes} from "../../library/api/errorCodes";
import {ApiStatusCodes} from "../../library/api/statusCodes";
import {ZodSchema} from "zod";

const check = (schema: ZodSchema) => async (
    req: FastifyRequest,
    reply: FastifyReply
) => {
    let apiResult = new ApiResult();
    try {
        let validatedData = await schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        req = Object.assign(req, validatedData);
    } catch (e: any) {
        apiResult.status = false;
        apiResult.message = e.errors;
        apiResult.errorCode = ApiErrorCodes.incorrectData;
        apiResult.statusCode = ApiStatusCodes.badRequest;
    } finally {
        if (!apiResult.status) {
            await reply.status(apiResult.statusCode).send(apiResult)
        }
    }
}

export const RequestMiddleware = {
    check: check
};
