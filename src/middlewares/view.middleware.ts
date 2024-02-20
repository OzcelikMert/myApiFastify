import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {ApiErrorCodes} from "../library/api/errorCodes";
import {ApiStatusCodes} from "../library/api/statusCodes";
import {ViewService} from "../services/view.service";
import Variable, {DateMask} from "../library/variable";
import {LogMiddleware} from "./log.middleware";
import {IViewPostSchema} from "../schemas/view.schema";

const check = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IViewPostSchema;

        let url = Variable.isEmpty(reqData.body.url) ? "/" : reqData.body.url;

        let dateStart = new Date(new Date().getStringWithMask(DateMask.DATE)),
            dateEnd = new Date(new Date().getStringWithMask(DateMask.DATE));
        dateEnd.addDays(1);

        let resData = await ViewService.getOne({
            ip: req.ip,
            url: url,
            dateStart: dateStart,
            dateEnd: dateEnd
        });

        if (resData) {
            serviceResult.status = false;
            serviceResult.errorCode = ApiErrorCodes.alreadyData;
            serviceResult.statusCode = ApiStatusCodes.conflict;
        }

        if (!serviceResult.status) {
            await reply.status(serviceResult.statusCode).send(serviceResult)
        }
    });
}
const checkAndDeleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let dateEnd = new Date();
        dateEnd.addDays(-7);

        let resData = await ViewService.getOne({dateEnd: dateEnd});

        if (resData) {
            await ViewService.deleteMany({dateEnd: dateEnd})
        }
    });
}

export const ViewMiddleware = {
    check: check,
    checkAndDeleteMany: checkAndDeleteMany
};