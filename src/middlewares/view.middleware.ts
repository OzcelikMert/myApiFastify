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
        let apiResult = new ApiResult();

        let reqData = req as IViewPostSchema;

        let url = Variable.isEmpty(reqData.body.url) ? "/" : reqData.body.url;

        let dateStart = new Date(new Date().getStringWithMask(DateMask.DATE)),
            dateEnd = new Date(new Date().getStringWithMask(DateMask.DATE));
        dateEnd.addDays(1);

        let serviceResult = await ViewService.get({
            ip: req.ip,
            url: url,
            dateStart: dateStart,
            dateEnd: dateEnd
        });

        if (serviceResult) {
            apiResult.status = false;
            apiResult.errorCode = ApiErrorCodes.alreadyData;
            apiResult.statusCode = ApiStatusCodes.conflict;
        }

        if (!apiResult.status) {
            await reply.status(apiResult.statusCode).send(apiResult)
        }
    });
}
const checkAndDeleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let dateEnd = new Date();
        dateEnd.addDays(-7);

        let serviceResult = await ViewService.get({dateEnd: dateEnd});

        if (serviceResult) {
            await ViewService.deleteMany({dateEnd: dateEnd})
        }
    });
}

export const ViewMiddleware = {
    check: check,
    checkAndDeleteMany: checkAndDeleteMany
};