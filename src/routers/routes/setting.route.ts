import { FastifyInstance } from 'fastify';
import settingSchema from "../../schemas/setting.schema";
import settingController from "../../controllers/setting.controller";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get('/get', { preHandler: [requestMiddleware.check(settingSchema.get)] }, settingController.get);
    fastify.put('/update/general', { preHandler: [requestMiddleware.check(settingSchema.putGeneral), sessionMiddleware.check, permissionMiddleware.check] }, settingController.setGeneral);
    fastify.put('/update/seo', { preHandler: [requestMiddleware.check(settingSchema.putSeo), sessionMiddleware.check, permissionMiddleware.check] }, settingController.setSeo);
    fastify.put('/update/contact-form', { preHandler: [requestMiddleware.check(settingSchema.putContactForm), sessionMiddleware.check, permissionMiddleware.check] }, settingController.setContactForm);
    fastify.put('/update/static-language', { preHandler: [requestMiddleware.check(settingSchema.putStaticLanguage), sessionMiddleware.check, permissionMiddleware.check] }, settingController.setStaticLanguage);
    fastify.put('/update/social-media', { preHandler: [requestMiddleware.check(settingSchema.putSocialMedia), sessionMiddleware.check, permissionMiddleware.check] }, settingController.setSocialMedia);
    fastify.put('/update/e-commerce', { preHandler: [requestMiddleware.check(settingSchema.putECommerce), sessionMiddleware.check, permissionMiddleware.check] }, settingController.setECommerce);
    done();
}