import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import logMiddleware from "../middlewares/log.middleware";
import sitemapService from "../services/sitemap.service";
import {PostTypeId} from "../constants/postTypes";
import {PostTermTypeId} from "../constants/postTermTypes";
import {SitemapSchemaGetPostDocument, SitemapSchemaGetPostTermDocument} from "../schemas/sitemap.schema";

const getMaps = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        serviceResult.data = {
            post: await sitemapService.getPostCount({typeId: [PostTypeId.Page, PostTypeId.Portfolio, PostTypeId.Blog]}),
            postTerm: await sitemapService.getPostTermCount({
                postTypeId: [PostTypeId.Page, PostTypeId.Portfolio, PostTypeId.Blog],
                typeId: [PostTermTypeId.Category, PostTermTypeId.Tag]
            })
        };

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getPost = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as SitemapSchemaGetPostDocument;

        serviceResult.data = await sitemapService.getPost(reqData.query);

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getPostTerm = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as SitemapSchemaGetPostTermDocument;

        serviceResult.data = await sitemapService.getPostTerm(reqData.query)

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

export default {
    getMaps: getMaps,
    getPost: getPost,
    getPostTerm: getPostTerm
};