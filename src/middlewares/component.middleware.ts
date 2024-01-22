import { FastifyRequest, FastifyReply } from 'fastify';
import {ErrorCodes, Result, StatusCodes} from "../library/api";
import componentService from "../services/component.service";
import logMiddleware from "./log.middleware";
import {ComponentSchemaDeleteManyDocument, ComponentSchemaPutDocument} from "../schemas/component.schema";

export default {
    checkOne: async (req: FastifyRequest, reply: FastifyReply) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let reqData = req as ComponentSchemaPutDocument;

            let resData = await componentService.getOne({_id: reqData.params._id});

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
    checkMany: async (req: FastifyRequest, reply: FastifyReply) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let reqData = req as ComponentSchemaDeleteManyDocument;

            let resData = await componentService.getMany({_id: reqData.body._id});

            if (
                resData.length == 0 ||
                (resData.length != reqData.body._id.length)
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