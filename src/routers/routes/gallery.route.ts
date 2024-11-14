import { FastifyInstance } from 'fastify';
import { GalleryController } from '@controllers/gallery.controller';
import { GallerySchema } from '@schemas/gallery.schema';
import { SessionAuthMiddleware } from '@middlewares/validates/sessionAuth.middleware';
import { RequestMiddleware } from '@middlewares/validates/request.middleware';
import { GalleryEndPoint } from '@constants/endPoints/gallery.endPoint';
import { GalleryMiddleware } from '@middlewares/gallery.middleware';

export const galleryRoute = function (
  fastify: FastifyInstance,
  opts: any,
  done: () => void
) {
  const endPoint = new GalleryEndPoint('');
  fastify.get(
    endPoint.GET_IMAGE,
    {
      preHandler: [
        RequestMiddleware.check(GallerySchema.getMany),
        SessionAuthMiddleware.check,
      ],
    },
    GalleryController.getManyImage
  );
  fastify.post(
    endPoint.ADD_IMAGE,
    { preHandler: [SessionAuthMiddleware.check] },
    GalleryController.addImage
  );
  fastify.delete(
    endPoint.DELETE_IMAGE,
    {
      preHandler: [
        RequestMiddleware.check(GallerySchema.deleteMany),
        SessionAuthMiddleware.check,
        GalleryMiddleware.checkMany,
        GalleryMiddleware.checkIsAuthorMany,
      ],
    },
    GalleryController.deleteManyImage
  );
  done();
};
