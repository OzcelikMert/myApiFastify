import { FastifyRequest, FastifyReply } from 'fastify';
import {ErrorCodes, Result, StatusCodes} from "../library/api";
import postService from "../services/post.service";
import logMiddleware from "./log.middleware";
import {
    PostSchemaDeleteManyDocument,
    PostSchemaPutDocument,
    PostSchemaPutManyStatusDocument
} from "../schemas/post.schema";

export default {
    check: async (req: FastifyRequest, reply: FastifyReply) => {
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
    checkUrl: async (req: FastifyRequest, reply: FastifyReply) => {
        await logMiddleware.error(req, reply, async () => {
            let reqData = req as PostSchemaPutDocument;

            if(reqData.body.contents){
                let title: string = reqData.body.contents.title || "";

                let urlAlreadyCount = 2;
                let url = title.convertSEOUrl();

                let oldUrl = url;
                while((await postService.getOne({
                    ignorePostId: reqData.params._id ? [reqData.params._id] : undefined,
                    typeId: reqData.body.typeId,
                    url: url
                }))) {
                    url = `${oldUrl}-${urlAlreadyCount}`;
                    urlAlreadyCount++;
                }

                reqData.body.contents.url = url;
            }
        });
    }
};