import { FastifyInstance } from 'fastify';
import settingSchema from "../../schemas/setting.schema";
import settingController from "../../controllers/setting.controller";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(SettingEndPoint.GET, { preHandler: [requestMiddleware.check(settingSchema.get)] }, settingController.get);
    fastify.put(SettingEndPoint.UPDATE_GENERAL, { preHandler: [requestMiddleware.check(settingSchema.putGeneral), sessionMiddleware.check, permissionMiddleware.check] }, settingController.updateGeneral);
    fastify.put(SettingEndPoint.UPDATE_SEO, { preHandler: [requestMiddleware.check(settingSchema.putSeo), sessionMiddleware.check, permissionMiddleware.check] }, settingController.updateSEO);
    fastify.put(SettingEndPoint.UPDATE_CONTACT_FORM, { preHandler: [requestMiddleware.check(settingSchema.putContactForm), sessionMiddleware.check, permissionMiddleware.check] }, settingController.updateContactForm);
    fastify.put(SettingEndPoint.UPDATE_STATIC_LANGUAGE, { preHandler: [requestMiddleware.check(settingSchema.putStaticLanguage), sessionMiddleware.check, permissionMiddleware.check] }, settingController.updateStaticLanguage);
    fastify.put(SettingEndPoint.UPDATE_SOCIAL_MEDIA, { preHandler: [requestMiddleware.check(settingSchema.putSocialMedia), sessionMiddleware.check, permissionMiddleware.check] }, settingController.updateSocialMedia);
    fastify.put(SettingEndPoint.UPDATE_ECOMMERCE, { preHandler: [requestMiddleware.check(settingSchema.putECommerce), sessionMiddleware.check, permissionMiddleware.check] }, settingController.updateECommerce);
    done();
}