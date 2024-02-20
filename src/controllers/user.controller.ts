import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {
    IUserDeleteOneSchema,
    IUserGetOneSchema,
    IUserGetManySchema,
    IUserPostSchema,
    IUserPutOneSchema,
    IUserPutPasswordSchema,
    IUserPutProfileSchema,
    IUserGetOneWithURLSchema
} from "../schemas/user.schema";
import {UserService} from "../services/user.service";
import {LogMiddleware} from "../middlewares/log.middleware";
import { EndPoints } from '../constants/endPoints';
import { UserEndPoint } from '../constants/endPoints/user.endPoint';

const getOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as IUserGetOneSchema;

        serviceResult.data = await UserService.getOne({
            ...reqData.params,
            ...reqData.query
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as IUserGetManySchema;

        serviceResult.data = await UserService.getMany({
            ...reqData.query,
        });

        console.log(serviceResult.data);
        
        
        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getOneWithURL = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as IUserGetOneWithURLSchema;

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

        let insertData = await UserService.add({
            ...reqData.body,
            ...(reqData.body.banDateEnd ? {banDateEnd: new Date(reqData.body.banDateEnd)} : {banDateEnd: undefined})
        });

        serviceResult.data = {_id: insertData._id};

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as IUserPutOneSchema

        serviceResult.data = await UserService.updateOne({
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

        serviceResult.data = await UserService.updateOne({
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

        serviceResult.data = await UserService.updateOne({
            _id: req.sessionAuth!.user!.userId.toString(),
            password: reqData.body.newPassword
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const deleteOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as IUserDeleteOneSchema;

        serviceResult.data = await UserService.deleteOne(reqData.params);

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

export const UserController = {
    getOne: getOne,
    getMany: getMany,
    getOneWithURL: getOneWithURL,
    add: add,
    updateOne: updateOne,
    updateProfile: updateProfile,
    updatePassword: updatePassword,
    deleteOne: deleteOne
};