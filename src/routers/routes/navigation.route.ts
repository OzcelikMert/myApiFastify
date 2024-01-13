import { FastifyInstance } from 'fastify';
import navigationSchema from "../../schemas/navigation.schema";
import navigationController from "../../controllers/navigation.controller";
import navigationMiddleware from "../../middlewares/navigation.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import navigationEndPoint from "../../constants/endPoints/navigation.endPoint";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(navigationEndPoint.GET, { preHandler: [requestMiddleware.check(navigationSchema.getMany)] }, navigationController.getMany);
    fastify.get(navigationEndPoint.GET_WITH_ID, { preHandler: [requestMiddleware.check(navigationSchema.get)] }, navigationController.getOne);
    fastify.post(navigationEndPoint.ADD, { preHandler: [requestMiddleware.check(navigationSchema.post), sessionMiddleware.check, permissionMiddleware.check] }, navigationController.add);
    fastify.put(navigationEndPoint.UPDATE_RANK_WITH_ID, { preHandler: [requestMiddleware.check(navigationSchema.putRank), sessionMiddleware.check, permissionMiddleware.check, navigationMiddleware.checkOne] }, navigationController.updateOneRank);
    fastify.put(navigationEndPoint.UPDATE_STATUS, { preHandler: [requestMiddleware.check(navigationSchema.putManyStatus), sessionMiddleware.check, permissionMiddleware.check, navigationMiddleware.checkMany] }, navigationController.updateManyStatus);
    fastify.put(navigationEndPoint.UPDATE_WITH_ID, { preHandler: [requestMiddleware.check(navigationSchema.put), sessionMiddleware.check, permissionMiddleware.check, navigationMiddleware.checkOne] }, navigationController.updateOne);
    fastify.delete(navigationEndPoint.DELETE, { preHandler: [requestMiddleware.check(navigationSchema.deleteMany), sessionMiddleware.check, permissionMiddleware.check, navigationMiddleware.checkMany] }, navigationController.deleteMany);
    done();
}