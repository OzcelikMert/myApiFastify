import { FastifyRequest, FastifyReply } from 'fastify';
import {ErrorCodes, Result, StatusCodes} from "../library/api";
import logMiddleware from "./log.middleware";
import navigationService from "../services/navigation.service";

export default {
    check: async (
        req: FastifyRequest<{Params: any}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let _id = req.params._id as string;

            let resData = await navigationService.getOne({_id: _id});

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
    checkMany: async (
        req: FastifyRequest<{Body: any }>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let _id = req.body._id as string[];

            let resData = await navigationService.getMany({_id: _id});

            if (
                resData.length == 0 ||
                (resData.length != _id.length)
            ) {
                serviceResult.status = false;
                serviceResult.errorCode = ErrorCodes.notFound;
                serviceResult.statusCode = StatusCodes.notFound;
            }

            if (!serviceResult.status) {
                reply.status(serviceResult.statusCode).send(serviceResult)
            }
        });
    }
};