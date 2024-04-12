import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "@library/api/result";
import {ViewService} from "@services/view.service";
import {Config} from "@configs/index";
import {LogMiddleware} from "@middlewares/log.middleware";
import {IViewGetTotalResultService} from "types/services/view.service";

const getNumber = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<{liveTotal: number, averageTotal: number, weeklyTotal: number}>();

        let dateStart = new Date();
        dateStart.addDays(-7);

        let serviceResult = await ViewService.getTotalWithDate({
            dateStart: dateStart
        });

        let total = 0;

        for (const data of serviceResult) {
            total += data.total;
        }

        let averageTotal = Math.ceil(total / 7);
        let weeklyTotal = total;

        apiResult.data = {
            liveTotal: Config.onlineUsers.length,
            averageTotal: averageTotal,
            weeklyTotal: weeklyTotal
        };

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const getStatistics = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<{day: IViewGetTotalResultService[], country: IViewGetTotalResultService[]}>();

        let dateStart = new Date();
        dateStart.addDays(-7);

        apiResult.data = {
            day: await ViewService.getTotalWithDate({dateStart: dateStart}),
            country: await ViewService.getTotalWithCountry({dateStart: dateStart}),
        };

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

export const ViewController = {
    getNumber: getNumber,
    getStatistics: getStatistics
};