import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {LogMiddleware} from "../middlewares/log.middleware";
import {SitemapService} from "../services/sitemap.service";
import {PostTypeId} from "../constants/postTypes";
import {PostTermTypeId} from "../constants/postTermTypes";
import {ISitemapGetPostSchema, ISitemapGetPostTermSchema} from "../schemas/sitemap.schema";
import {
    ISitemapGetMapsResultService,
    ISitemapGetPostResultService,
    ISitemapGetPostTermResultService
} from "../types/services/sitemap.service";

const getMaps = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<ISitemapGetMapsResultService>();

        apiResult.data = {
            post: await SitemapService.getPostCount({typeId: [PostTypeId.Page, PostTypeId.Portfolio, PostTypeId.Blog]}),
            postTerm: await SitemapService.getPostTermCount({
                postTypeId: [PostTypeId.Page, PostTypeId.Portfolio, PostTypeId.Blog],
                typeId: [PostTermTypeId.Category, PostTermTypeId.Tag]
            })
        };

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const getPost = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<ISitemapGetPostResultService[]>();

        const reqData = req as ISitemapGetPostSchema;

        apiResult.data = await SitemapService.getPost(reqData.query);

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

const getPostTerm = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<ISitemapGetPostTermResultService[]>();

        const reqData = req as ISitemapGetPostTermSchema;

        apiResult.data = await SitemapService.getPostTerm(reqData.query)

        await reply.status(apiResult.statusCode).send(apiResult)
    });
}

export const SitemapController = {
    getMaps: getMaps,
    getPost: getPost,
    getPostTerm: getPostTerm
};