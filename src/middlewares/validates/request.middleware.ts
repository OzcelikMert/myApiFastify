import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiResult } from '@library/api/result';
import { ApiErrorCodes } from '@library/api/errorCodes';
import { ApiStatusCodes } from '@library/api/statusCodes';
import { ZodSchema } from 'zod';

const check =
  (schema: ZodSchema) => async (req: FastifyRequest, reply: FastifyReply) => {
    const apiResult = new ApiResult<any, any>();
    try {
      const validatedData = await schema.safeParseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      if (validatedData.success) {
        req = Object.assign(req, validatedData.data);
      } else {
        apiResult.status = false;
        apiResult.message = validatedData.error.format();
        apiResult.customData = Object.assign(
          { query: req.query },
          { body: req.body },
          { params: req.params }
        );
        apiResult.setErrorCode = ApiErrorCodes.incorrectData;
        apiResult.setStatusCode = ApiStatusCodes.badRequest;
      }
    } catch (e: any) {
      apiResult.status = false;
      apiResult.message = e.format ? e.format() : (e.errors ?? '');
      apiResult.setErrorCode = ApiErrorCodes.incorrectData;
      apiResult.setStatusCode = ApiStatusCodes.badRequest;
    } finally {
      if (!apiResult.status) {
        await reply.status(apiResult.getStatusCode).send(apiResult);
      }
    }
  };

export const RequestMiddleware = {
  check: check,
};
