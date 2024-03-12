import { FastifyRequest, FastifyReply } from 'fastify';
import {ApiResult} from "../../library/api/result";
import {ApiErrorCodes} from "../../library/api/errorCodes";
import {ApiStatusCodes} from "../../library/api/statusCodes";
import {ZodSchema} from "zod";

const check = (schema: ZodSchema) => async (
    req: FastifyRequest,
    reply: FastifyReply
) => {
    let apiResult = new ApiResult<any>();
    try {
        let validatedData = await schema.safeParseAsync({
            body: req.body,
            query: req.query,
            params: req.params
        });
        console.log(req.url, validatedData)
        if(validatedData.success){
            req = Object.assign(req, validatedData.data);
        }else {
            apiResult.status = false;
            apiResult.message = validatedData.error.format();
            apiResult.data = req.query;
            apiResult.errorCode = ApiErrorCodes.incorrectData;
            apiResult.statusCode = ApiStatusCodes.badRequest;
        }
    } catch (e: any) {
        apiResult.status = false;
        apiResult.message = e.format ? e.format() : e.errors ?? "";
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
