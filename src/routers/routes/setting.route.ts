import { FastifyInstance } from 'fastify';
import settingSchema from "../../schemas/setting.schema";
import settingController from "../../controllers/setting.controller";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";
import settingEndPoint from "../../constants/endPoints/setting.endPoint";
import settingPermission from "../../constants/permissions/setting.permission";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(settingEndPoint.GET, { preHandler: [requestMiddleware.check(settingSchema.get)] }, settingController.get);
    fastify.put(settingEndPoint.UPDATE_GENERAL, { preHandler: [requestMiddleware.check(settingSchema.putGeneral), sessionMiddleware.check, permissionMiddleware.check(settingPermission.updateGeneral)] }, settingController.updateGeneral);
    fastify.put(settingEndPoint.UPDATE_SEO, { preHandler: [requestMiddleware.check(settingSchema.putSeo), sessionMiddleware.check, permissionMiddleware.check(settingPermission.updateSEO)] }, settingController.updateSEO);
    fastify.put(settingEndPoint.UPDATE_CONTACT_FORM, { preHandler: [requestMiddleware.check(settingSchema.putContactForm), sessionMiddleware.check, permissionMiddleware.check(settingPermission.updateContactForm)] }, settingController.updateContactForm);
    fastify.put(settingEndPoint.UPDATE_STATIC_LANGUAGE, { preHandler: [requestMiddleware.check(settingSchema.putStaticLanguage), sessionMiddleware.check, permissionMiddleware.check(settingPermission.updateStaticLanguage)] }, settingController.updateStaticLanguage);
    fastify.put(settingEndPoint.UPDATE_SOCIAL_MEDIA, { preHandler: [requestMiddleware.check(settingSchema.putSocialMedia), sessionMiddleware.check, permissionMiddleware.check(settingPermission.updateSocialMedia)] }, settingController.updateSocialMedia);
    fastify.put(settingEndPoint.UPDATE_ECOMMERCE, { preHandler: [requestMiddleware.check(settingSchema.putECommerce), sessionMiddleware.check, permissionMiddleware.check(settingPermission.updateECommerce)] }, settingController.updateECommerce);
    done();
}