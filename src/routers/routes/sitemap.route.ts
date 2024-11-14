import { FastifyInstance } from 'fastify';
import { SitemapController } from '@controllers/sitemap.controller';
import { SitemapSchema } from '@schemas/sitemap.schema';
import { RequestMiddleware } from '@middlewares/validates/request.middleware';
import { SitemapEndPoint } from '@constants/endPoints/sitemap.endPoint';

export const sitemapRoute = function (
  fastify: FastifyInstance,
  opts: any,
  done: () => void
) {
  const endPoint = new SitemapEndPoint('');
  fastify.get(endPoint.GET_MAPS, SitemapController.getMaps);
  fastify.get(
    endPoint.GET_POST,
    { preHandler: [RequestMiddleware.check(SitemapSchema.getPost)] },
    SitemapController.getPost
  );
  fastify.get(
    endPoint.GET_POST_TERM,
    { preHandler: [RequestMiddleware.check(SitemapSchema.getPostTerm)] },
    SitemapController.getPostTerm
  );
  done();
};
