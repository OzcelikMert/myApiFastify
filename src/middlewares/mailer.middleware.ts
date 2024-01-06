import { FastifyRequest, FastifyReply } from 'fastify';
import {ErrorCodes, Result, StatusCodes} from "../library/api";
import mailerSchema from "../schemas/mailer.schema";
import settingService from "../services/setting.service";
import logMiddleware from "./log.middleware";
import zod from "zod";

export default {
    checkContactForm: async (
        req: FastifyRequest<{Params: any, Body: (zod.infer<typeof mailerSchema.post>["body"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let setting = (await settingService.get({}));

            if((typeof setting.contactForms === "undefined") || (setting.contactForms && setting.contactForms?.indexOfKey("_id", req.body.contactFormId) < 0)){
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