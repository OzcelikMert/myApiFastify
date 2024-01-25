import { FastifyRequest, FastifyReply } from 'fastify';
import {ErrorCodes, Result, StatusCodes} from "../library/api";
import postTermService from "../services/postTerm.service";
import logMiddleware from "./log.middleware";
import {PostTermSchemaDeleteManyDocument, PostTermSchemaPutDocument} from "../schemas/postTerm.schema";
import {UserRoleId} from "../constants/userRoles";
import permissionUtil from "../utils/permission.util";

export default {
    checkOne: async (req: FastifyRequest, reply: FastifyReply) => {
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
    checkOneIsAuthor: async (req: FastifyRequest, reply: FastifyReply) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let reqData = req as PostTermSchemaPutDocument;

            if (!permissionUtil.checkPermissionRoleRank(UserRoleId.Editor, req.sessionAuth.user!.roleId)) {
                let postTerm = await postTermService.getOne({
                    _id: reqData.params._id,
                    postTypeId: reqData.body.postTypeId,
                    typeId: reqData.body.typeId,
                });

                if (postTerm) {
                    if (postTerm.authorId.toString() != req.sessionAuth.user?.userId.toString()) {
                        serviceResult.status = false;
                        serviceResult.errorCode = ErrorCodes.noPerm;
                        serviceResult.statusCode = StatusCodes.forbidden;
                    }
                }
            }

            if (!serviceResult.status) {
                reply.status(serviceResult.statusCode).send(serviceResult)
            }
        });
    },
    checkManyIsAuthor: async (req: FastifyRequest, reply: FastifyReply) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let reqData = req as PostTermSchemaDeleteManyDocument;

            if (!permissionUtil.checkPermissionRoleRank(UserRoleId.Editor, req.sessionAuth.user!.roleId)) {
                let postTerms = await postTermService.getMany({
                    _id: reqData.body._id,
                    postTypeId: reqData.body.postTypeId,
                    typeId: [reqData.body.typeId],
                });

                if (postTerms) {
                    for (const postTerm of postTerms) {
                        if (postTerm.authorId.toString() != req.sessionAuth.user?.userId.toString()) {
                            serviceResult.status = false;
                            serviceResult.errorCode = ErrorCodes.noPerm;
                            serviceResult.statusCode = StatusCodes.forbidden;
                            break;
                        }
                    }
                }
            }

            if (!serviceResult.status) {
                reply.status(serviceResult.statusCode).send(serviceResult)
            }
        });
    },
};