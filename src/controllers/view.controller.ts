import {FastifyRequest, FastifyReply} from 'fastify';
import {Result} from "../library/api";
import {lookup} from "geoip-lite";
import viewService from "../services/view.service";
import {Config} from "../config";
import logMiddleware from "../middlewares/log.middleware";
import {ViewSchemaPostDocument} from "../schemas/view.schema";
import Variable from "../library/variable";

const getNumber = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let dateStart = new Date();
        dateStart.addDays(-7);

        let resData = await viewService.getTotalWithDate({
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

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getStatistics = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        let dateStart = new Date();
        dateStart.addDays(-7);

        serviceResult.data = {
            day: await viewService.getTotalWithDate({dateStart: dateStart}),
            country: await viewService.getTotalWithCountry({dateStart: dateStart}),
        };

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        const reqData = req as ViewSchemaPostDocument;

        let ip = req.ip;
        let ipDetail = lookup(req.ip);

        let insertData = await viewService.add({
            ...reqData.body,
            ip: ip,
            url: Variable.isEmpty(reqData.body.url) ? "/" : reqData.body.url,
            ...ipDetail
        })

        serviceResult.data = {_id: insertData._id};

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

export default {
    getNumber: getNumber,
    getStatistics: getStatistics,
    add: add,
};