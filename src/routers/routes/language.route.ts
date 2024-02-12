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
    fastify.get(LanguageEndPoint.GET, { preHandler: [RequestMiddleware.check(LanguageSchema.getMany)] }, LanguageController.getMany);
    fastify.get(LanguageEndPoint.GET_FLAGS, { preHandler: [SessionAuthMiddleware.check, PermissionMiddleware.check(LanguageEndPointPermission.GET_FLAGS)] }, LanguageController.getFlags);
    fastify.get(LanguageEndPoint.GET_WITH_ID, { preHandler: [RequestMiddleware.check(LanguageSchema.getOne)] }, LanguageController.getOne);
    fastify.post(LanguageEndPoint.ADD, { preHandler: [RequestMiddleware.check(LanguageSchema.post), SessionAuthMiddleware.check, PermissionMiddleware.check(LanguageEndPointPermission.ADD)] }, LanguageController.add);
    fastify.put(LanguageEndPoint.UPDATE_RANK_WITH_ID, { preHandler: [RequestMiddleware.check(LanguageSchema.putOneRank), SessionAuthMiddleware.check, PermissionMiddleware.check(LanguageEndPointPermission.UPDATE), LanguageMiddleware.checkOne] }, LanguageController.updateOneRank);
    fastify.put(LanguageEndPoint.UPDATE_WITH_ID, { preHandler: [RequestMiddleware.check(LanguageSchema.putOne), SessionAuthMiddleware.check, PermissionMiddleware.check(LanguageEndPointPermission.UPDATE), LanguageMiddleware.checkOne] }, LanguageController.updateOne);
    done();
}