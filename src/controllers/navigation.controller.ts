import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {LogMiddleware} from "../middlewares/log.middleware";
import {NavigationService} from "../services/navigation.service";
import {
    INavigationDeleteManySchema,
    INavigationGetWithIdSchema,
    INavigationGetManySchema,
    INavigationPostSchema,
    INavigationPutWithIdSchema,
    INavigationPutManyStatusSchema,
    INavigationPutWithIdRankSchema
} from "../schemas/navigation.schema";
import {INavigationGetResultService} from "../types/services/navigation.service";
import {INavigationModel} from "../types/models/navigation.model";

const getWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<INavigationGetResultService>();

        let reqData = req as INavigationGetWithIdSchema;

        serviceResult.data = await NavigationService.getOne({
            ...reqData.params,
            ...reqData.query
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    })
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<INavigationGetResultService[]>();

        let reqData = req as INavigationGetManySchema;

        serviceResult.data = await NavigationService.getMany({
            ...reqData.query
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    })
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<INavigationModel>();

        let reqData = req as INavigationPostSchema;

        serviceResult.data = await NavigationService.add({
            ...reqData.body,
            authorId: req.sessionAuth!.user!.userId.toString(),
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as INavigationPutWithIdSchema;

        await NavigationService.updateOne({
            ...reqData.params,
            ...reqData.body,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateWithIdRank = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as INavigationPutWithIdRankSchema;

        await NavigationService.updateOneRank({
            ...reqData.params,
            ...reqData.body,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const updateManyStatus = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as INavigationPutManyStatusSchema;

        await NavigationService.updateManyStatus({
            ...reqData.body,
            lastAuthorId: req.sessionAuth!.user!.userId.toString()
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const deleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as INavigationDeleteManySchema;

        await NavigationService.deleteMany({
            ...reqData.body
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

export const NavigationController = {
    getWithId: getWithId,
    getMany: getMany,
    add: add,
    updateWithId: updateWithId,
    updateWithIdRank: updateWithIdRank,
    updateManyStatus: updateManyStatus,
    deleteMany: deleteMany
};