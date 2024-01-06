import {FastifyInstance} from 'fastify';
import serverInfoController from "../../controllers/serverInfo.controller";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";
import {PermissionId} from "../../constants/permissions";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get('/get', { preHandler: [sessionMiddleware.check, permissionMiddleware.check([PermissionId.SettingEdit])] }, serverInfoController.get);
    done();
}