import { FastifyInstance } from 'fastify';
import {SettingSchema} from "../../schemas/setting.schema";
import {SettingController} from "../../controllers/setting.controller";
import {RequestMiddleware} from "../../middlewares/validates/request.middleware";
import {SessionAuthMiddleware} from "../../middlewares/validates/sessionAuth.middleware";
import {PermissionMiddleware} from "../../middlewares/validates/permission.middleware";
import {SettingEndPoint} from "../../constants/endPoints/setting.endPoint";
import {SettingEndPointPermission} from "../../constants/endPointPermissions/setting.endPoint.permission";

export const settingRoute = function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(SettingEndPoint.GET, { preHandler: [RequestMiddleware.check(SettingSchema.get)] }, SettingController.get);
    fastify.put(SettingEndPoint.UPDATE_GENERAL, { preHandler: [RequestMiddleware.check(SettingSchema.putGeneral), SessionAuthMiddleware.check, PermissionMiddleware.check(SettingEndPointPermission.UPDATE_GENERAL)] }, SettingController.updateGeneral);
    fastify.put(SettingEndPoint.UPDATE_SEO, { preHandler: [RequestMiddleware.check(SettingSchema.putSeo), SessionAuthMiddleware.check, PermissionMiddleware.check(SettingEndPointPermission.UPDATE_SEO)] }, SettingController.updateSEO);
    fastify.put(SettingEndPoint.UPDATE_CONTACT_FORM, { preHandler: [RequestMiddleware.check(SettingSchema.putContactForm), SessionAuthMiddleware.check, PermissionMiddleware.check(SettingEndPointPermission.UPDATE_CONTACT_FORM)] }, SettingController.updateContactForm);
    fastify.put(SettingEndPoint.UPDATE_STATIC_LANGUAGE, { preHandler: [RequestMiddleware.check(SettingSchema.putStaticLanguage), SessionAuthMiddleware.check, PermissionMiddleware.check(SettingEndPointPermission.UPDATE_STATIC_LANGUAGE)] }, SettingController.updateStaticLanguage);
    fastify.put(SettingEndPoint.UPDATE_SOCIAL_MEDIA, { preHandler: [RequestMiddleware.check(SettingSchema.putSocialMedia), SessionAuthMiddleware.check, PermissionMiddleware.check(SettingEndPointPermission.UPDATE_SOCIAL_MEDIA)] }, SettingController.updateSocialMedia);
    fastify.put(SettingEndPoint.UPDATE_ECOMMERCE, { preHandler: [RequestMiddleware.check(SettingSchema.putECommerce), SessionAuthMiddleware.check, PermissionMiddleware.check(SettingEndPointPermission.UPDATE_ECOMMERCE)] }, SettingController.updateECommerce);
    done();
}