import { FastifyRequest, FastifyReply } from 'fastify';
import {Config} from "../../config";
import logMiddleware from "../log.middleware";

export default {
    set: async (
        req: FastifyRequest,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let ip = req.ip;
            let date = new Date();
            let _id = (req.session && req.sessionAuth.data() && req.sessionAuth.user) ? req.sessionAuth.user.userId.toString() : "";

            Config.onlineUsers = Config.onlineUsers.filter(onlineUser => Number(date.diffMinutes(onlineUser.updatedAt)) < 10);

            let findIndex = Config.onlineUsers.indexOfKey("ip", ip);
            if(findIndex > -1){
                Config.onlineUsers[findIndex].updatedAt = date;
                Config.onlineUsers[findIndex]._id = _id;
            }else {
                Config.onlineUsers.push({
                    ip: ip,
                    createdAt: date,
                    updatedAt: date,
                    _id: _id
                })
            }
        });
    }
};