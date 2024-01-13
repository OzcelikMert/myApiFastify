import { FastifyInstance } from 'fastify';
import sitemapController from "../../controllers/sitemap.controller";
import sitemapSchema from "../../schemas/sitemap.schema";
import requestMiddleware from "../../middlewares/validates/request.middleware";
import sitemapEndPoint from "../../constants/endPoints/sitemap.endPoint";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get(sitemapEndPoint.GET_MAPS, sitemapController.getMaps);
    fastify.get(sitemapEndPoint.GET_POST, { preHandler: [requestMiddleware.check(sitemapSchema.getPost)] }, sitemapController.getPost);
    fastify.get(sitemapEndPoint.GET_POST_TERM, { preHandler: [requestMiddleware.check(sitemapSchema.getPostTerm)] }, sitemapController.getPostTerm);
    done();
}