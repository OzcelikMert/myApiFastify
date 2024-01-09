import { FastifyInstance } from 'fastify';
import galleryController from "../../controllers/gallery.controller";
import gallerySchema from "../../schemas/gallery.schema";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";
import requestMiddleware from "../../middlewares/validates/request.middleware";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(GalleryEndPoint.GET, { preHandler: [sessionMiddleware.check] }, galleryController.get);
    fastify.post(GalleryEndPoint.ADD, { preHandler: [sessionMiddleware.check, permissionMiddleware.check] }, galleryController.add);
    fastify.delete(GalleryEndPoint.DELETE, { preHandler: [requestMiddleware.check(gallerySchema.delete), sessionMiddleware.check, permissionMiddleware.check] }, galleryController.delete);
    done();
}