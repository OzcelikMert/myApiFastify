import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "@library/api/result";
import {
    IUserDeleteWithIdSchema,
    IUserGetWithIdSchema,
    IUserGetManySchema,
    IUserPostSchema,
    IUserPutWithIdSchema,
    IUserPutPasswordSchema,
    IUserPutProfileSchema,
    IUserGetWithURLSchema, IUserPutProfileImageSchema
} from "@schemas/user.schema";
import {UserService} from "@services/user.service";
import {LogMiddleware} from "@middlewares/log.middleware";
import {IUserGetDetailedResultService} from "types/services/user.service";
import {IUserModel} from "types/models/user.model";
import {SessionAuthUtil} from "@utils/sessinAuth.util";

const getWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IUserGetDetailedResultService>();

        const reqData = req as IUserGetWithIdSchema;

        apiResult.data = await UserService.getDetailed({
            ...reqData.params,
            ...reqData.query
        }, !req.isFromAdminPanel);

        await reply.status(apiResult.getStatusCode).send(apiResult)
    });
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IUserGetDetailedResultService[]>();

        const reqData = req as IUserGetManySchema;

        apiResult.data = await UserService.getManyDetailed({
            ...reqData.query,
        }, !req.isFromAdminPanel);

        await reply.status(apiResult.getStatusCode).send(apiResult)
    });
}

const getWithURL = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IUserGetDetailedResultService>();

        const reqData = req as IUserGetWithURLSchema;

        apiResult.data = await UserService.getDetailed({
            ...reqData.params,
            ...reqData.query
        }, !req.isFromAdminPanel);

        await reply.status(apiResult.getStatusCode).send(apiResult)
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

        await reply.status(apiResult.getStatusCode).send(apiResult)
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

        await reply.status(apiResult.getStatusCode).send(apiResult)
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
            name: reqData.body.name,
            updatedAt: new Date()
        })

        await reply.status(apiResult.getStatusCode).send(apiResult)
    });
}

const updateProfileImage = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        const reqData = req as IUserPutProfileImageSchema;

        await UserService.update({
            ...reqData.body,
            _id: req.sessionAuth!.user!.userId.toString(),
        });

        req.sessionAuth!.set("user", {
            ...req.sessionAuth!.user!,
            image: reqData.body.image,
            updatedAt: new Date()
        })

        await reply.status(apiResult.getStatusCode).send(apiResult)
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
            let token = SessionAuthUtil.createToken(serviceResult._id.toString(), serviceResult.email, serviceResult.password, req.ip);
            req.sessionAuth!.set("_id", token);
            req.sessionAuth!.set("user", {
                ...req.sessionAuth!.user!,
                updatedAt: new Date()
            })
        }

        await reply.status(apiResult.getStatusCode).send(apiResult)
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

        await reply.status(apiResult.getStatusCode).send(apiResult)
    });
}

export const UserController = {
    getWithId: getWithId,
    getMany: getMany,
    getWithURL: getWithURL,
    add: add,
    updateWithId: updateWithId,
    updateProfile: updateProfile,
    updateProfileImage: updateProfileImage,
    updatePassword: updatePassword,
    deleteWithId: deleteWithId,

};