import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {lookup} from "geoip-lite";
import {ViewService} from "../services/view.service";
import {Config} from "../config";
import {LogMiddleware} from "../middlewares/log.middleware";
import {IViewPostSchema} from "../schemas/view.schema";
import Variable from "../library/variable";
import {IViewGetTotalResultService} from "../types/services/view.service";

const getNumber = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<{liveTotal: number, averageTotal: number, weeklyTotal: number}>();

        let dateStart = new Date();
        dateStart.addDays(-7);

        let resData = await ViewService.getTotalWithDate({
            dateStart: dateStart
        });

        let total = 0;

        for (const data of resData) {
            total += data.total;
        }

        let averageTotal = Math.ceil(total / 7);
        let weeklyTotal = total;

        serviceResult.data = {
            liveTotal: Config.onlineUsers.length,
            averageTotal: averageTotal,
            weeklyTotal: weeklyTotal
        };

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getStatistics = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<{day: IViewGetTotalResultService[], country: IViewGetTotalResultService[]}>();

        let dateStart = new Date();
        dateStart.addDays(-7);

        serviceResult.data = {
            day: await ViewService.getTotalWithDate({dateStart: dateStart}),
            country: await ViewService.getTotalWithCountry({dateStart: dateStart}),
        };

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as IViewPostSchema;

        let ip = req.ip;
        let ipDetail = lookup(req.ip);

        await ViewService.add({
            ...reqData.body,
            ip: ip,
            url: Variable.isEmpty(reqData.body.url) ? "/" : reqData.body.url,
            ...ipDetail
        })

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

export const ViewController = {
    getNumber: getNumber,
    getStatistics: getStatistics,
    add: add,
};