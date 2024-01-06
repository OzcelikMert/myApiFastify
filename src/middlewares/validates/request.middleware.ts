import { FastifyRequest, FastifyReply } from 'fastify';
import {ErrorCodes, Result, StatusCodes} from "../../library/api";
import logMiddleware from "../log.middleware";
import {ZodSchema} from "zod";

export default {
    check: (schema: ZodSchema) => async (
        req: FastifyRequest,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();
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
                serviceResult.errorCode = ErrorCodes.incorrectData;
                serviceResult.statusCode = StatusCodes.badRequest;
            } finally {
                if (!serviceResult.status) {
                    reply.status(serviceResult.statusCode).send(serviceResult)
                }
            }
        });
    }
};
