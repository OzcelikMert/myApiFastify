import {FastifyRequest, FastifyReply} from 'fastify';
import {Result} from "../library/api";
import {
    UserSchemaDeleteDocument,
    UserSchemaGetDocument,
    UserSchemaGetManyDocument,
    UserSchemaPostDocument, UserSchemaPutDocument, UserSchemaPutPasswordDocument, UserSchemaPutProfileDocument
} from "../schemas/user.schema";
import userService from "../services/user.service";
import logMiddleware from "../middlewares/log.middleware";

const getOne = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        const reqData = req as UserSchemaGetDocument;

        serviceResult.data = await userService.getOne({
            ...reqData.params,
            ...reqData.query
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        const reqData = req as UserSchemaGetManyDocument;

        serviceResult.data = await userService.getMany({
            ...reqData.query,
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

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
        let serviceResult = new Result();

        const reqData = req as UserSchemaPutDocument

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
        let serviceResult = new Result();

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
        let serviceResult = new Result();

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
        let serviceResult = new Result();

        const reqData = req as UserSchemaDeleteDocument;

        serviceResult.data = await userService.deleteOne(reqData.params);

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

export default {
    getOne: getOne,
    getMany: getMany,
    add: add,
    updateOne: updateOne,
    updateProfile: updateProfile,
    updatePassword: updatePassword,
    deleteOne: deleteOne
};