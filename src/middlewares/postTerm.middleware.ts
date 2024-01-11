import { FastifyRequest, FastifyReply } from 'fastify';
import {ErrorCodes, Result, StatusCodes} from "../library/api";
import postTermService from "../services/postTerm.service";
import logMiddleware from "./log.middleware";
import {PostTermSchemaDeleteManyDocument, PostTermSchemaPutDocument} from "../schemas/postTerm.schema";

export default {
    check: async (req: FastifyRequest, reply: FastifyReply) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let reqData = req as PostTermSchemaPutDocument;

            let resData = await postTermService.getOne({
                _id: reqData.params._id,
                postTypeId: reqData.body.postTypeId,
                typeId: reqData.body.typeId,
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

            let reqData = req as PostTermSchemaDeleteManyDocument;

            let resData = await postTermService.getMany({
                _id: reqData.body._id,
                postTypeId: reqData.body.postTypeId,
                typeId: [reqData.body.typeId],
            });

            if (
                resData.length === 0 ||
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
            let reqData = req as PostTermSchemaPutDocument;

            if(reqData.body.contents){
                let title: string = reqData.body.contents.title || "";

                let urlAlreadyCount = 2;
                let url = title.convertSEOUrl();

                let oldUrl = url;
                while((await postTermService.getOne({
                    ignoreTermId: reqData.params._id ? [reqData.params._id] : undefined,
                    typeId: reqData.body.typeId,
                    postTypeId: reqData.body.postTypeId,
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