import { FastifyRequest, FastifyReply } from 'fastify';
import {ErrorCodes, Result, StatusCodes} from "../library/api";
import postService from "../services/post.service";
import logMiddleware from "./log.middleware";
import {
    PostSchemaDeleteManyDocument,
    PostSchemaPutDocument
} from "../schemas/post.schema";

export default {
    checkOne: async (req: FastifyRequest, reply: FastifyReply) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let reqData = req as PostSchemaPutDocument;

            let resData = await postService.getOne({
                _id: reqData.params._id,
                typeId: reqData.body.typeId
            });

            if (!resData) {
                serviceResult.status = false;
                serviceResult.errorCode = ErrorCodes.notFound;
                serviceResult.statusCode = StatusCodes.notFound;
            }

            if (!serviceResult.status) {
                reply.status(serviceResult.statusCode).send(serviceResult)
            }
        });
    },
    checkMany: async (req: FastifyRequest, reply: FastifyReply) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let reqData = req as PostSchemaDeleteManyDocument;

            let resData = await postService.getMany({
                _id: reqData.body._id,
                typeId: [reqData.body.typeId]
            });

            if (
                resData.length == 0 ||
                (resData.length != reqData.body._id.length)
            ) {
                serviceResult.status = false;
                serviceResult.errorCode = ErrorCodes.notFound;
                serviceResult.statusCode = StatusCodes.notFound;
            }

            if (!serviceResult.status) {
                reply.status(serviceResult.statusCode).send(serviceResult)
            }
        });
    },
};