import { FastifyInstance } from 'fastify';
import {GalleryController} from "../../controllers/gallery.controller";
import gallerySchema from "../../schemas/gallery.schema";
import sessionMiddleware from "../../middlewares/validates/sessionAuth.middleware";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import {GalleryEndPoint} from "../../constants/endPoints/gallery.endPoint";
import galleryMiddleware from "../../middlewares/gallery.middleware";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(GalleryEndPoint.GET_IMAGE, { preHandler: [requestMiddleware.check(gallerySchema.getMany), sessionMiddleware.check] }, GalleryController.getManyImage);
    fastify.post(GalleryEndPoint.ADD_IMAGE, { preHandler: [sessionMiddleware.check] }, GalleryController.addImage);
    fastify.delete(GalleryEndPoint.DELETE_IMAGE, { preHandler: [requestMiddleware.check(gallerySchema.deleteMany), sessionMiddleware.check, galleryMiddleware.checkManyIsAuthor] }, GalleryController.deleteManyImage);
    done();
}