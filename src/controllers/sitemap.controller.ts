import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {LogMiddleware} from "../middlewares/log.middleware";
import {SitemapService} from "../services/sitemap.service";
import {PostTypeId} from "../constants/postTypes";
import {PostTermTypeId} from "../constants/postTermTypes";
import {ISitemapGetPostSchema, ISitemapGetPostTermSchema} from "../schemas/sitemap.schema";
import {
    ISitemapMapPostCountService,
    ISitemapMapPostTermCountService,
    ISitemapPostService, ISitemapPostTermService
} from "../types/services/sitemap.service";

const getMaps = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<{post: ISitemapMapPostCountService[], postTerm: ISitemapMapPostTermCountService[]}>();

        serviceResult.data = {
            post: await SitemapService.getPostCount({typeId: [PostTypeId.Page, PostTypeId.Portfolio, PostTypeId.Blog]}),
            postTerm: await SitemapService.getPostTermCount({
                postTypeId: [PostTypeId.Page, PostTypeId.Portfolio, PostTypeId.Blog],
                typeId: [PostTermTypeId.Category, PostTermTypeId.Tag]
            })
        };

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getPost = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<ISitemapPostService[]>();

        const reqData = req as ISitemapGetPostSchema;

        serviceResult.data = await SitemapService.getPost(reqData.query);

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const getPostTerm = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<ISitemapPostTermService[]>();

        const reqData = req as ISitemapGetPostTermSchema;

        serviceResult.data = await SitemapService.getPostTerm(reqData.query)

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

export const SitemapController = {
    getMaps: getMaps,
    getPost: getPost,
    getPostTerm: getPostTerm
};