import { FastifyInstance } from 'fastify';
import sitemapController from "../../controllers/sitemap.controller";
import sitemapSchema from "../../schemas/sitemap.schema";
import requestMiddleware from "../../middlewares/validates/request.middleware";

export default function (fastify: FastifyInstance, opts: any, done: () => void) {
    fastify.get('/get/maps', sitemapController.getMaps);
    fastify.get('/get/post', { preHandler: [requestMiddleware.check(sitemapSchema.getPost)] }, sitemapController.getPost);
    fastify.get('/get/post-term', { preHandler: [requestMiddleware.check(sitemapSchema.getPostTerm)] }, sitemapController.getPostTerm);
    done();
}