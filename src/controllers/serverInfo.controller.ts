import {ApiResult} from "@library/api/result";
import osu from "node-os-utils";
import checkDiskSpace from "check-disk-space";
import os from "os";
import {Config} from "@configs/index";
import {LogMiddleware} from "@middlewares/log.middleware";
import {FastifyReply, FastifyRequest} from "fastify";

const get = async (req: FastifyRequest, reply: FastifyReply) => {
    return await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<{cpu: string, memory: string, storage: string}>();
        let cpu = await osu.cpu.usage();
        let diskSpace = await checkDiskSpace(Config.paths.root);

        apiResult.data = {
            cpu: cpu.toFixed(2),
            memory: (100 - (100 / os.totalmem()) * os.freemem()).toFixed(2),
            storage: (100 - ((diskSpace.free * 100) / diskSpace.size)).toFixed(2)
        }

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

export const ServerInfoController = {
    get: get
};