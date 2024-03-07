import { FastifyInstance } from 'fastify';
import {LanguageSchema} from "../../schemas/language.schema";
import {LanguageController} from "../../controllers/language.controller";
import {LanguageMiddleware} from "../../middlewares/language.middleware";
import {RequestMiddleware} from "../../middlewares/validates/request.middleware";
import {SessionAuthMiddleware} from "../../middlewares/validates/sessionAuth.middleware";
import {PermissionMiddleware} from "../../middlewares/validates/permission.middleware";
import {LanguageEndPoint} from "../../constants/endPoints/language.endPoint";
import {LanguageEndPointPermission} from "../../constants/endPointPermissions/language.endPoint.permission";

export const languageRoute = function (fastify: FastifyInstance, opts: any, done: () => void) {
    const languageEndPoint = new LanguageEndPoint("");
    fastify.get(languageEndPoint.GET, { preHandler: [RequestMiddleware.check(LanguageSchema.getMany)] }, LanguageController.getMany);
    fastify.get(languageEndPoint.GET_DEFAULT, { preHandler: [RequestMiddleware.check(LanguageSchema.getDefault)] }, LanguageController.getDefault);
    fastify.get(languageEndPoint.GET_FLAGS, { preHandler: [SessionAuthMiddleware.check, PermissionMiddleware.check(LanguageEndPointPermission.GET_FLAGS)] }, LanguageController.getFlags);
    fastify.get(languageEndPoint.GET_WITH_ID, { preHandler: [RequestMiddleware.check(LanguageSchema.getWithId)] }, LanguageController.getWithId);
    fastify.post(languageEndPoint.ADD, { preHandler: [RequestMiddleware.check(LanguageSchema.post), SessionAuthMiddleware.check, PermissionMiddleware.check(LanguageEndPointPermission.ADD)] }, LanguageController.add);
    fastify.put(languageEndPoint.UPDATE_RANK_WITH_ID, { preHandler: [RequestMiddleware.check(LanguageSchema.putRankWithId), SessionAuthMiddleware.check, PermissionMiddleware.check(LanguageEndPointPermission.UPDATE), LanguageMiddleware.checkWithId] }, LanguageController.updateRankWithId);
    fastify.put(languageEndPoint.UPDATE_WITH_ID, { preHandler: [RequestMiddleware.check(LanguageSchema.putWithId), SessionAuthMiddleware.check, PermissionMiddleware.check(LanguageEndPointPermission.UPDATE), LanguageMiddleware.checkWithId, LanguageMiddleware.checkIsDefaultWithId] }, LanguageController.updateWithId);
    done();
}