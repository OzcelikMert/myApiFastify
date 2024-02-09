import {FastifyInstance} from 'fastify';
import {ServerInfoController} from "../../controllers/serverInfo.controller";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";
import {ServerInfoEndPoint} from "../../constants/endPoints/serverInfo.endPoint";
import {ServerInfoEndPointPermission} from "../../constants/endPointPermissions/serverInfo.endPoint.permission";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(ServerInfoEndPoint.GET, { preHandler: [sessionMiddleware.check, permissionMiddleware.check(ServerInfoEndPointPermission.GET)] }, ServerInfoController.get);
    done();
}