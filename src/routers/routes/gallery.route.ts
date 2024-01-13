import { FastifyInstance } from 'fastify';
import galleryController from "../../controllers/gallery.controller";
import gallerySchema from "../../schemas/gallery.schema";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import permissionMiddleware from "../../middlewares/validates/permission.middleware";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import galleryEndPoint from "../../constants/endPoints/gallery.endPoint";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(galleryEndPoint.GET, { preHandler: [sessionMiddleware.check] }, galleryController.get);
    fastify.post(galleryEndPoint.ADD, { preHandler: [sessionMiddleware.check, permissionMiddleware.check] }, galleryController.add);
    fastify.delete(galleryEndPoint.DELETE, { preHandler: [requestMiddleware.check(gallerySchema.delete), sessionMiddleware.check, permissionMiddleware.check] }, galleryController.delete);
    done();
}