import { FastifyInstance } from 'fastify';
import galleryController from "../../controllers/gallery.controller";
import gallerySchema from "../../schemas/gallery.schema";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import galleryEndPoint from "../../constants/endPoints/gallery.endPoint";
import galleryMiddleware from "../../middlewares/gallery.middleware";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(galleryEndPoint.GET_IMAGE, { preHandler: [requestMiddleware.check(gallerySchema.getMany), sessionMiddleware.check] }, galleryController.getManyImage);
    fastify.post(galleryEndPoint.ADD_IMAGE, { preHandler: [sessionMiddleware.check] }, galleryController.addImage);
    fastify.delete(galleryEndPoint.DELETE_IMAGE, { preHandler: [requestMiddleware.check(gallerySchema.deleteMany), sessionMiddleware.check, galleryMiddleware.checkManyIsAuthor] }, galleryController.deleteManyImage);
    done();
}