import { FastifyRequest, FastifyReply } from 'fastify';
import {ErrorCodes, Result, StatusCodes} from "../library/api";
import viewService from "../services/view.service";
import Variable, {DateMask} from "../library/variable";
import logMiddleware from "./log.middleware";

export default {
    check: async (
        req: FastifyRequest<{Params: any}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            req.body.url = Variable.isEmpty(req.body.url) ? "/" : req.body.url;
            let url = req.body.url;

            let dateStart = new Date(new Date().getStringWithMask(DateMask.DATE)),
                dateEnd = new Date(new Date().getStringWithMask(DateMask.DATE));
            dateEnd.addDays(1);

            let resData = await viewService.getOne({
                ip: req.ip,
                url: url,
                dateStart: dateStart,
                dateEnd: dateEnd
            });

            if (resData) {
                serviceResult.status = false;
                serviceResult.errorCode = ErrorCodes.alreadyData;
                serviceResult.statusCode = StatusCodes.conflict;
            }

            if (!serviceResult.status) {
                reply.status(serviceResult.statusCode).send(serviceResult)
            }
        });
    },
    checkAndDeleteMany: async (
        req: FastifyRequest<{Body: any }>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let dateEnd = new Date();
            dateEnd.addDays(-7);

            let resData = await viewService.getOne({dateEnd: dateEnd});

            if (resData) {
                await viewService.deleteMany({dateEnd: dateEnd})
            }
        });
    }
};