import { FastifyInstance } from 'fastify';
import languageSchema from "../../schemas/language.schema";
import languageController from "../../controllers/language.controller";
import languageMiddleware from "../../middlewares/language.middleware";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";
import languageEndPoint from "../../constants/endPoints/language.endPoint";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(languageEndPoint.GET, { preHandler: [requestMiddleware.check(languageSchema.getMany)] }, languageController.getMany);
    fastify.get(languageEndPoint.GET_FLAGS, { preHandler: [sessionMiddleware.check, permissionMiddleware.check] }, languageController.getFlags);
    fastify.get(languageEndPoint.GET_WITH_ID, { preHandler: [requestMiddleware.check(languageSchema.get)] }, languageController.getOne);
    fastify.post(languageEndPoint.ADD, { preHandler: [requestMiddleware.check(languageSchema.post), sessionMiddleware.check, permissionMiddleware.check] }, languageController.add);
    fastify.put(languageEndPoint.UPDATE_RANK_WITH_ID, { preHandler: [requestMiddleware.check(languageSchema.putRank), sessionMiddleware.check, permissionMiddleware.check, languageMiddleware.check] }, languageController.updateOneRank);
    fastify.put(languageEndPoint.UPDATE_WITH_ID, { preHandler: [requestMiddleware.check(languageSchema.put), sessionMiddleware.check, permissionMiddleware.check, languageMiddleware.check] }, languageController.updateOne);
    done();
}