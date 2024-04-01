import {FastifyReply, FastifyRequest} from 'fastify';
import {ApiResult} from "../library/api/result";
import {ApiErrorCodes} from "../library/api/errorCodes";
import {ApiStatusCodes} from "../library/api/statusCodes";
import {LogMiddleware} from "./log.middleware";
import {IComponentDeleteManySchema, IComponentPutWithIdSchema} from "../schemas/component.schema";
import {ComponentService} from "../services/component.service";
import {PermissionUtil} from "../utils/permission.util";
import {UserRoleId} from "../constants/userRoles";

const checkWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IComponentPutWithIdSchema;

        let serviceResult = await ComponentService.get({_id: reqData.params._id});

        if (!serviceResult) {
            apiResult.status = false;
            apiResult.errorCode = ApiErrorCodes.notFound;
            apiResult.statusCode = ApiStatusCodes.notFound;
        }

        if (!apiResult.status) {
            await reply.status(apiResult.statusCode).send(apiResult)
        }
    });
}

const checkMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IComponentDeleteManySchema;

        let serviceResult = await ComponentService.getMany({_id: reqData.body._id});

        if (
            serviceResult.length == 0 ||
            (serviceResult.length != reqData.body._id.length)
        ) {
            apiResult.status = false;
            apiResult.errorCode = ApiErrorCodes.notFound;
            apiResult.statusCode = ApiStatusCodes.notFound;
        }

        if (!apiResult.status) {
            await reply.status(apiResult.statusCode).send(apiResult)
        }
    });
}

const checkPermissionWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IComponentPutWithIdSchema;

        let serviceResult = await ComponentService.get({_id: reqData.params._id});

        if (serviceResult && !PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.SuperAdmin)) {
            let reqToCheck = {
                key: reqData.body.key,
                typeId: reqData.body.typeId,
                title: reqData.body.title,
                elements: reqData.body.elements.map(item => ({
                    _id: item._id,
                    key: item.key,
                    rank: item.rank,
                    title: item.title,
                    typeId: item.typeId
                }))
            }

            let serviceToCheck = {
                key: serviceResult.key,
                typeId: serviceResult.typeId,
                title: serviceResult.title,
                elements: serviceResult.elements.map(item => ({
                    _id: item._id,
                    key: item.key,
                    rank: item.rank,
                    title: item.title,
                    typeId: item.typeId
                }))
            }

            if (JSON.stringify(reqToCheck) != JSON.stringify(serviceToCheck)) {
                apiResult.status = false;
                apiResult.errorCode = ApiErrorCodes.noPerm;
                apiResult.statusCode = ApiStatusCodes.forbidden;
            }
        }

        if (!apiResult.status) {
            await reply.status(apiResult.statusCode).send(apiResult)
        }
    });
}

export const ComponentMiddleware = {
    checkWithId: checkWithId,
    checkMany: checkMany,
    checkPermissionWithId: checkPermissionWithId
};