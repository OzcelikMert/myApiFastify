import { FastifyInstance } from 'fastify';
import languageSchema from "../../schemas/language.schema";
import languageController from "../../controllers/language.controller";
import languageMiddleware from "../../middlewares/language.middleware";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(LanguageEndPoint.GET, { preHandler: [requestMiddleware.check(languageSchema.getMany)] }, languageController.getMany);
    fastify.get(LanguageEndPoint.GET_FLAGS, { preHandler: [sessionMiddleware.check, permissionMiddleware.check] }, languageController.getFlags);
    fastify.get(LanguageEndPoint.GET_WITH_ID, { preHandler: [requestMiddleware.check(languageSchema.get)] }, languageController.getOne);
    fastify.post(LanguageEndPoint.ADD, { preHandler: [requestMiddleware.check(languageSchema.post), sessionMiddleware.check, permissionMiddleware.check] }, languageController.add);
    fastify.put(LanguageEndPoint.UPDATE_RANK_WITH_ID, { preHandler: [requestMiddleware.check(languageSchema.putRank), sessionMiddleware.check, permissionMiddleware.check, languageMiddleware.checkOne] }, languageController.updateOneRank);
    fastify.put(LanguageEndPoint.UPDATE_WITH_ID, { preHandler: [requestMiddleware.check(languageSchema.put), sessionMiddleware.check, permissionMiddleware.check, languageMiddleware.checkOne] }, languageController.updateOne);
    done();
}