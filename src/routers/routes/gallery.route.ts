import { FastifyInstance } from 'fastify';
import galleryController from "../../controllers/gallery.controller";
import gallerySchema from "../../schemas/gallery.schema";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";
import requestMiddleware from "../../middlewares/validates/request.middleware";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get('/get', { preHandler: [sessionMiddleware.check] }, galleryController.get);
    fastify.post('/add', { preHandler: [sessionMiddleware.check, permissionMiddleware.check] }, galleryController.add);
    fastify.delete('/delete', { preHandler: [requestMiddleware.check(gallerySchema.delete), sessionMiddleware.check, permissionMiddleware.check] }, galleryController.delete);
    done();
}