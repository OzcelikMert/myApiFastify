import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {
    UserSchemaDeleteOneDocument,
    UserSchemaGetOneDocument,
    UserSchemaGetManyDocument,
    UserSchemaPostDocument,
    UserSchemaPutOneDocument,
    UserSchemaPutPasswordDocument,
    UserSchemaPutProfileDocument,
    UserSchemaGetOneWithURLDocument
} from "../schemas/user.schema";
import userService from "../services/user.service";
import logMiddleware from "../middlewares/log.middleware";

const getOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as UserSchemaGetOneDocument;

        serviceResult.data = await userService.getOne({
            ...reqData.params,
            ...reqData.query
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as UserSchemaGetManyDocument;

        serviceResult.data = await userService.getMany({
            ...reqData.query,
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getOneWithURL = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as UserSchemaGetOneWithURLDocument;

        serviceResult.data = await userService.getOne({
            ...reqData.params,
            ...reqData.query
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as UserSchemaPostDocument;

        let insertData = await userService.add({
            ...reqData.body,
            ...(reqData.body.banDateEnd ? {banDateEnd: new Date(reqData.body.banDateEnd)} : {banDateEnd: undefined})
        });

        serviceResult.data = {_id: insertData._id};

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as UserSchemaPutOneDocument

        serviceResult.data = await userService.updateOne({
            ...reqData.params,
            ...reqData.body,
            ...(reqData.body.banDateEnd ? {banDateEnd: new Date(reqData.body.banDateEnd)} : {banDateEnd: undefined})
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateProfile = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as UserSchemaPutProfileDocument;

        serviceResult.data = await userService.updateOne({
            ...reqData.body,
            _id: req.sessionAuth!.user!.userId.toString(),
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updatePassword = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as UserSchemaPutPasswordDocument;

        serviceResult.data = await userService.updateOne({
            _id: req.sessionAuth!.user!.userId.toString(),
            password: reqData.body.newPassword
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const deleteOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as UserSchemaDeleteOneDocument;

        serviceResult.data = await userService.deleteOne(reqData.params);

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

export default {
    getOne: getOne,
    getMany: getMany,
    getOneWithURL: getOneWithURL,
    add: add,
    updateOne: updateOne,
    updateProfile: updateProfile,
    updatePassword: updatePassword,
    deleteOne: deleteOne
};