import { FastifyRequest, FastifyReply } from 'fastify';
import {Result} from "../library/api";
import {lookup} from "geoip-lite";
import zod from "zod";
import viewSchema from "../schemas/view.schema";
import viewService from "../services/view.service";
import {Config} from "../config";
import logMiddleware from "../middlewares/log.middleware";

export default {
    getNumber: async (
        req: FastifyRequest,
        reply: FastifyReply
    ) => {
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
    },
    getStatistics: async (
        req: FastifyRequest,
        reply: FastifyReply
    ) => {
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
    },
    add: async (
        req: FastifyRequest<{Body: (zod.infer<typeof viewSchema.post>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let ip = req.ip;
            let ipDetail = lookup(req.ip);

            let insertData = await viewService.add({
                ...req.body,
                ip: ip,
                ...ipDetail
            })

            serviceResult.data = {_id: insertData._id};

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
};