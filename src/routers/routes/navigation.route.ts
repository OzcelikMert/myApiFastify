import { FastifyInstance } from 'fastify';
import navigationSchema from "../../schemas/navigation.schema";
import navigationController from "../../controllers/navigation.controller";
import navigationMiddleware from "../../middlewares/navigation.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import {NavigationEndPoint} from "../../constants/endPoints/navigation.endPoint";
import {NavigationEndPointPermission} from "../../constants/endPointPermissions/navigation.endPoint.permission";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(NavigationEndPoint.GET, { preHandler: [requestMiddleware.check(navigationSchema.getMany)] }, navigationController.getMany);
    fastify.get(NavigationEndPoint.GET_WITH_ID, { preHandler: [requestMiddleware.check(navigationSchema.getOne)] }, navigationController.getOne);
    fastify.post(NavigationEndPoint.ADD, { preHandler: [requestMiddleware.check(navigationSchema.post), sessionMiddleware.check, permissionMiddleware.check(NavigationEndPointPermission.ADD)] }, navigationController.add);
    fastify.put(NavigationEndPoint.UPDATE_RANK_WITH_ID, { preHandler: [requestMiddleware.check(navigationSchema.putOneRank), sessionMiddleware.check, permissionMiddleware.check(NavigationEndPointPermission.UPDATE), navigationMiddleware.checkOne] }, navigationController.updateOneRank);
    fastify.put(NavigationEndPoint.UPDATE_STATUS, { preHandler: [requestMiddleware.check(navigationSchema.putManyStatus), sessionMiddleware.check, permissionMiddleware.check(NavigationEndPointPermission.UPDATE), navigationMiddleware.checkMany] }, navigationController.updateManyStatus);
    fastify.put(NavigationEndPoint.UPDATE_WITH_ID, { preHandler: [requestMiddleware.check(navigationSchema.putOne), sessionMiddleware.check, permissionMiddleware.check(NavigationEndPointPermission.UPDATE), navigationMiddleware.checkOne] }, navigationController.updateOne);
    fastify.delete(NavigationEndPoint.DELETE, { preHandler: [requestMiddleware.check(navigationSchema.deleteMany), sessionMiddleware.check, permissionMiddleware.check(NavigationEndPointPermission.DELETE), navigationMiddleware.checkMany] }, navigationController.deleteMany);
    done();
}