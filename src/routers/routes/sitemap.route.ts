import { FastifyInstance } from 'fastify';
import {SitemapController} from "../../controllers/sitemap.controller";
import {SitemapSchema} from "../../schemas/sitemap.schema";
import {RequestMiddleware} from "../../middlewares/validates/request.middleware";
import {SitemapEndPoint} from "../../constants/endPoints/sitemap.endPoint";

export const sitemapRoute = function (fastify: FastifyInstance, opts: any, done: () => void) {
    const sitemapEndPoint = new SitemapEndPoint("");
    fastify.get(sitemapEndPoint.GET_MAPS, SitemapController.getMaps);
    fastify.get(sitemapEndPoint.GET_POST, { preHandler: [RequestMiddleware.check(SitemapSchema.getPost)] }, SitemapController.getPost);
    fastify.get(sitemapEndPoint.GET_POST_TERM, { preHandler: [RequestMiddleware.check(SitemapSchema.getPostTerm)] }, SitemapController.getPostTerm);
    done();
}