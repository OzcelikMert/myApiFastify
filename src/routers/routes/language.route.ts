import { FastifyInstance } from 'fastify';
import languageSchema from "../../schemas/language.schema";
import languageController from "../../controllers/language.controller";
import languageMiddleware from "../../middlewares/language.middleware";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get('/get', { preHandler: [requestMiddleware.check(languageSchema.getMany)] }, languageController.getMany);
    fastify.get('/get/flags', { preHandler: [sessionMiddleware.check, permissionMiddleware.check] }, languageController.getFlags);
    fastify.get('/get/:_id', { preHandler: [requestMiddleware.check(languageSchema.get)] }, languageController.getOne);
    fastify.post('/add', { preHandler: [requestMiddleware.check(languageSchema.post), sessionMiddleware.check, permissionMiddleware.check] }, languageController.add);
    fastify.put('/update/rank/:_id', { preHandler: [requestMiddleware.check(languageSchema.putRank), sessionMiddleware.check, permissionMiddleware.check, languageMiddleware.checkOne] }, languageController.updateOneRank);
    fastify.put('/update/:_id', { preHandler: [requestMiddleware.check(languageSchema.put), sessionMiddleware.check, permissionMiddleware.check, languageMiddleware.checkOne] }, languageController.updateOne);
    done();
}