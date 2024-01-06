import { FastifyRequest, FastifyReply } from 'fastify';
import {Result} from "../library/api";
import zod from "zod";
import sitemapSchema from "../schemas/sitemap.schema";
import logMiddleware from "../middlewares/log.middleware";
import sitemapService from "../services/sitemap.service";
import {PostTypeId} from "../constants/postTypes";
import {PostTermTypeId} from "../constants/postTermTypes";

export default {
    getMaps: async (
        req: FastifyRequest,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = {
                post: await sitemapService.getPostCount({typeId: [PostTypeId.Page, PostTypeId.Portfolio, PostTypeId.Blog]}),
                postTerm: await sitemapService.getPostTermCount({postTypeId: [PostTypeId.Page, PostTypeId.Portfolio, PostTypeId.Blog], typeId: [PostTermTypeId.Category, PostTermTypeId.Tag]})
            };

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    getPost: async (
        req: FastifyRequest<{Querystring: (zod.infer<typeof sitemapSchema.getPost>["query"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await sitemapService.getPost(req.query);

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    },
    getPostTerm: async (
        req: FastifyRequest<{Querystring: (zod.infer<typeof sitemapSchema.getPostTerm>["query"])}>,
        reply: FastifyReply
    ) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            serviceResult.data = await sitemapService.getPostTerm(req.query)

            reply.status(serviceResult.statusCode).send(serviceResult)
        });
    }
};