import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {LogMiddleware} from "../middlewares/log.middleware";
import {NavigationService} from "../services/navigation.service";
import {
    INavigationDeleteManySchema,
    INavigationGetWithIdSchema,
    INavigationGetManySchema,
    INavigationPostSchema,
    INavigationPutWithIdSchema, INavigationPutRankWithIdSchema, INavigationPutStatusManySchema
} from "../schemas/navigation.schema";
import {INavigationGetResultService} from "../types/services/navigation.service";
import {INavigationModel} from "../types/models/navigation.model";

const getWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<INavigationGetResultService>();

        let reqData = req as INavigationGetWithIdSchema;

        apiResult.data = await NavigationService.get({
            ...reqData.params,
            ...reqData.query
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    })
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<INavigationGetResultService[]>();

        let reqData = req as INavigationGetManySchema;

        apiResult.data = await NavigationService.getMany({
            ...reqData.query
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    })
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<INavigationModel>();

        let reqData = req as INavigationPostSchema;

        apiResult.data = await NavigationService.add({
            ...reqData.body,
            authorId: req.sessionAuth!.user!.userId.toString(),
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const updateWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as INavigationPutWithIdSchema;

        await NavigationService.update({
            ...reqData.params,
            ...reqData.body,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const updateRankWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as INavigationPutRankWithIdSchema;

        await NavigationService.updateRank({
            ...reqData.params,
            ...reqData.body,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const updateStatusMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as INavigationPutStatusManySchema;

        await NavigationService.updateStatusMany({
            ...reqData.body,
            lastAuthorId: req.sessionAuth!.user!.userId.toString()
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const deleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as INavigationDeleteManySchema;

        await NavigationService.deleteMany({
            ...reqData.body
        });

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

export const NavigationController = {
    getWithId: getWithId,
    getMany: getMany,
    add: add,
    updateWithId: updateWithId,
    updateRankWithId: updateRankWithId,
    updateStatusMany: updateStatusMany,
    deleteMany: deleteMany
};