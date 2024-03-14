import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {
    IUserDeleteWithIdSchema,
    IUserGetWithIdSchema,
    IUserGetManySchema,
    IUserPostSchema,
    IUserPutWithIdSchema,
    IUserPutPasswordSchema,
    IUserPutProfileSchema,
    IUserGetWithURLSchema
} from "../schemas/user.schema";
import {UserService} from "../services/user.service";
import {LogMiddleware} from "../middlewares/log.middleware";
import {IUserGetResultService} from "../types/services/user.service";
import {IUserModel} from "../types/models/user.model";
import {SessionAuthUtil} from "../utils/sessinAuth.util";

const getWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IUserGetResultService>();

        const reqData = req as IUserGetWithIdSchema;

        apiResult.data = await UserService.get({
            ...reqData.params,
            ...reqData.query
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IUserGetResultService[]>();

        const reqData = req as IUserGetManySchema;

        apiResult.data = await UserService.getMany({
            ...reqData.query,
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const getWithURL = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IUserGetResultService>();

        const reqData = req as IUserGetWithURLSchema;

        apiResult.data = await UserService.get({
            ...reqData.params,
            ...reqData.query
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IUserModel>();

        const reqData = req as IUserPostSchema;

        apiResult.data = await UserService.add({
            ...reqData.body,
            ...(reqData.body.banDateEnd ? {banDateEnd: new Date(reqData.body.banDateEnd)} : {banDateEnd: undefined}),
            authorId: req.sessionAuth!.user!.userId.toString(),
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const updateWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        const reqData = req as IUserPutWithIdSchema

        await UserService.update({
            ...reqData.params,
            ...reqData.body,
            ...(reqData.body.banDateEnd ? {banDateEnd: new Date(reqData.body.banDateEnd)} : {banDateEnd: undefined}),
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const updateProfile = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        const reqData = req as IUserPutProfileSchema;

        await UserService.update({
            ...reqData.body,
            _id: req.sessionAuth!.user!.userId.toString(),
        });

        req.sessionAuth!.set("user", {
            ...req.sessionAuth!.user!,
            image: reqData.body.image ?? req.sessionAuth!.user!.image,
            name: reqData.body.name
        })

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const updatePassword = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        const reqData = req as IUserPutPasswordSchema;

        let serviceResult = await UserService.update({
            _id: req.sessionAuth!.user!.userId.toString(),
            password: reqData.body.newPassword
        });

        if(serviceResult){
            req.sessionAuth!.set("_id", SessionAuthUtil.createToken(serviceResult._id.toString(), serviceResult.password, req.ip))
        }

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const deleteWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        const reqData = req as IUserDeleteWithIdSchema;

        await UserService.delete({
            ...reqData.params,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

export const UserController = {
    getWithId: getWithId,
    getMany: getMany,
    getWithURL: getWithURL,
    add: add,
    updateWithId: updateWithId,
    updateProfile: updateProfile,
    updatePassword: updatePassword,
    deleteWithId: deleteWithId
};