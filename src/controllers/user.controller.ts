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

const getWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<IUserGetResultService>();

        const reqData = req as IUserGetWithIdSchema;

        serviceResult.data = await UserService.getOne({
            ...reqData.params,
            ...reqData.query
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<IUserGetResultService[]>();

        const reqData = req as IUserGetManySchema;

        serviceResult.data = await UserService.getMany({
            ...reqData.query,
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getWithURL = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<IUserGetResultService>();

        const reqData = req as IUserGetWithURLSchema;

        serviceResult.data = await UserService.getOne({
            ...reqData.params,
            ...reqData.query
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as IUserPostSchema;

        await UserService.add({
            ...reqData.body,
            ...(reqData.body.banDateEnd ? {banDateEnd: new Date(reqData.body.banDateEnd)} : {banDateEnd: undefined})
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as IUserPutWithIdSchema

        await UserService.updateOne({
            ...reqData.params,
            ...reqData.body,
            ...(reqData.body.banDateEnd ? {banDateEnd: new Date(reqData.body.banDateEnd)} : {banDateEnd: undefined})
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateProfile = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as IUserPutProfileSchema;

        await UserService.updateOne({
            ...reqData.body,
            _id: req.sessionAuth!.user!.userId.toString(),
        });

        req.sessionAuth!.set("user", {
            ...req.sessionAuth!.user!,
            image: reqData.body.image ?? req.sessionAuth!.user!.image,
            name: reqData.body.name
        })

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updatePassword = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as IUserPutPasswordSchema;

        await UserService.updateOne({
            _id: req.sessionAuth!.user!.userId.toString(),
            password: reqData.body.newPassword
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const deleteWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as IUserDeleteWithIdSchema;

        await UserService.deleteOne(reqData.params);

        await reply.status(serviceResult.statusCode).send(serviceResult)
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