import { FastifyInstance } from 'fastify';
import languageSchema from "../../schemas/language.schema";
import {LanguageController} from "../../controllers/language.controller";
import languageMiddleware from "../../middlewares/language.middleware";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";
import {LanguageEndPoint} from "../../constants/endPoints/language.endPoint";
import {LanguageEndPointPermission} from "../../constants/endPointPermissions/language.endPoint.permission";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(LanguageEndPoint.GET, { preHandler: [requestMiddleware.check(languageSchema.getMany)] }, LanguageController.getMany);
    fastify.get(LanguageEndPoint.GET_FLAGS, { preHandler: [sessionMiddleware.check, permissionMiddleware.check(LanguageEndPointPermission.GET_FLAGS)] }, LanguageController.getFlags);
    fastify.get(LanguageEndPoint.GET_WITH_ID, { preHandler: [requestMiddleware.check(languageSchema.getOne)] }, LanguageController.getOne);
    fastify.post(LanguageEndPoint.ADD, { preHandler: [requestMiddleware.check(languageSchema.post), sessionMiddleware.check, permissionMiddleware.check(LanguageEndPointPermission.ADD)] }, LanguageController.add);
    fastify.put(LanguageEndPoint.UPDATE_RANK_WITH_ID, { preHandler: [requestMiddleware.check(languageSchema.putOneRank), sessionMiddleware.check, permissionMiddleware.check(LanguageEndPointPermission.UPDATE), languageMiddleware.checkOne] }, LanguageController.updateOneRank);
    fastify.put(LanguageEndPoint.UPDATE_WITH_ID, { preHandler: [requestMiddleware.check(languageSchema.putOne), sessionMiddleware.check, permissionMiddleware.check(LanguageEndPointPermission.UPDATE), languageMiddleware.checkOne] }, LanguageController.updateOne);
    done();
}