import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "@library/api/result";
import {ApiErrorCodes} from "@library/api/errorCodes";
import {ApiStatusCodes} from "@library/api/statusCodes";
import {ViewService} from "@services/view.service";
import {LogMiddleware} from "@middlewares/log.middleware";
import {IViewPostSchema} from "@schemas/view.schema";
import {VariableLibrary} from "@library/variable";
import {DateMask} from "@library/variable/date";
import {lookup} from "geoip-lite";

const check = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IViewPostSchema;

        let url = VariableLibrary.isEmpty(reqData.body.url) ? "/" : reqData.body.url;
        let ip = req.ip;

        let dateStart = new Date(new Date().getStringWithMask(DateMask.DATE)),
            dateEnd = new Date(new Date().getStringWithMask(DateMask.DATE));
        dateEnd.addDays(1);

        let serviceResult = await ViewService.get({
            ip: ip,
            url: url,
            dateStart: dateStart,
            dateEnd: dateEnd
        });

        if (serviceResult) {
            apiResult.status = false;
            apiResult.errorCode = ApiErrorCodes.alreadyData;
            apiResult.statusCode = ApiStatusCodes.conflict;
        }else {
            let ipDetail = lookup(req.ip);
            await ViewService.add({
                ...reqData.body,
                ip: ip,
                url: url,
                ...ipDetail
            });
        }

        if (!apiResult.status) {
            await reply.status(apiResult.statusCode).send(apiResult)
        }
    });
}

export const ViewMiddleware = {
    check: check
};