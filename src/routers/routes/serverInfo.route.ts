import {FastifyInstance} from 'fastify';
import serverInfoController from "../../controllers/serverInfo.controller";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";
import serverInfoEndPoint from "../../constants/endPoints/serverInfo.endPoint";
import serverInfoPermission from "../../constants/permissions/serverInfo.permission";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(serverInfoEndPoint.GET, { preHandler: [sessionMiddleware.check, permissionMiddleware.check(serverInfoPermission.get)] }, serverInfoController.get);
    done();
}