import { FastifyRequest, FastifyReply } from 'fastify';
import {ErrorCodes, Result, StatusCodes} from "../library/api";
import postService from "../services/post.service";
import logMiddleware from "./log.middleware";

export default {
    check: async (
        req: FastifyRequest<{Params: any}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let _id = req.params._id as string;
            let typeId = req.params.typeId as number;

            let resData = await postService.getOne({
                _id: _id,
                typeId: typeId
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
    checkMany: async (
        req: FastifyRequest<{Body: any }>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let _id = req.body._id as string[];
            let typeId = req.params.typeId as number;

            let resData = await postService.getMany({
                _id: _id,
                typeId: [typeId]
            });

            if (
                resData.length == 0 ||
                (resData.length != _id.length)
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
    checkUrl: async (
        req: FastifyRequest<{Params: any}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let _id = req.params._id as string | undefined;
            let typeId = req.params.typeId as number;

            if(req.body.contents){
                let title: string = req.body.contents.title || "";

                let urlAlreadyCount = 2;
                let url = title.convertSEOUrl();

                let oldUrl = url;
                while((await postService.getOne({
                    ignorePostId: _id ? [_id] : undefined,
                    typeId: typeId,
                    url: url
                }))) {
                    url = `${oldUrl}-${urlAlreadyCount}`;
                    urlAlreadyCount++;
                }

                req.body.contents.url = url;
            }
        });
    }
};