import {FastifyReply, FastifyRequest} from 'fastify';
import {ApiResult} from "@library/api/result";
import {PostService} from "@services/post.service";
import {LogMiddleware} from "@middlewares/log.middleware";
import {
    IPostDeleteManySchema,
    IPostDeleteProductManySchema,
    IPostGetCountSchema,
    IPostGetManySchema,
    IPostGetPrevNextWithURLSchema,
    IPostGetWithIdSchema,
    IPostGetWithURLSchema,
    IPostPostProductSchema,
    IPostPostSchema,
    IPostPutProductWithIdSchema,
    IPostPutRankWithIdSchema,
    IPostPutStatusManySchema,
    IPostPutViewWithIdSchema,
    IPostPutWithIdSchema,
} from "@schemas/post.schema";
import {PermissionUtil} from "@utils/permission.util";
import {UserRoleId} from "@constants/userRoles";
import {
    IPostGetDetailedResultService,
    IPostGetPrevNextResultService, IPostGetManyDetailedResultService,
} from "types/services/post.service";
import {IPostECommerceVariationModel, IPostModel} from "types/models/post.model";
import {PageTypeId} from "@constants/pageTypes";
import {PostTypeId} from "@constants/postTypes";
import {StatusId} from "@constants/status";
import {ProductTypeId} from "@constants/productTypes";
import {MongoDBHelpers} from "@library/mongodb/helpers";

const getWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IPostGetDetailedResultService>();

        let reqData = req as IPostGetWithIdSchema;

        apiResult.data = await PostService.getDetailed({
            ...reqData.params,
            ...reqData.query,
            ...(!PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor) ? {authorId: req.sessionAuth!.user!.userId.toString()} : {})
        });

        await reply.status(apiResult.statusCode).send(apiResult);
    })
}

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IPostGetManyDetailedResultService[]>();

        let reqData = req as IPostGetManySchema;

        apiResult.data = await PostService.getManyDetailed({
            ...reqData.query,
            ...(req.isFromAdminPanel && !PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor) ? {authorId: req.sessionAuth!.user!.userId.toString()} : {})
        });

        await reply.status(apiResult.statusCode).send(apiResult);
    })
}

const getWithURL = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IPostGetDetailedResultService>();

        let reqData = req as IPostGetWithURLSchema;

        apiResult.data = await PostService.getDetailed({
            ...reqData.params,
            ...reqData.query,
            url: reqData.query.pageTypeId && reqData.query.pageTypeId != PageTypeId.Default ? undefined : reqData.params.url
        });

        await reply.status(apiResult.statusCode).send(apiResult);
    })
}

const getPrevNextWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<{prev?: IPostGetPrevNextResultService | null, next?: IPostGetPrevNextResultService | null }>();

        let reqData = req as IPostGetPrevNextWithURLSchema;

        apiResult.data = {
            prev: await PostService.getPrevNext({
                ...reqData.query,
                prevId: reqData.params._id
            }),
            next: await PostService.getPrevNext({
                ...reqData.query,
                nextId: reqData.params._id
            })
        };

        await reply.status(apiResult.statusCode).send(apiResult);
    })
}

const getCount = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<number>();

        let reqData = req as IPostGetCountSchema;

        apiResult.data = await PostService.getCount({
            ...reqData.query
        });

        await reply.status(apiResult.statusCode).send(apiResult);
    });
}

const add = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IPostModel>();

        let reqData = req as IPostPostSchema;

        apiResult.data = await PostService.add({
            ...reqData.body,
            authorId: req.sessionAuth!.user!.userId.toString(),
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(apiResult.statusCode).send(apiResult);
    });
}

const addProduct = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<IPostModel>();

        let reqData = req as IPostPostProductSchema;

        let productId = MongoDBHelpers.createObjectId().toString();
        let variations: IPostECommerceVariationModel[] = [];

        for(const variation of reqData.body.eCommerce.variations) {
            let serviceResultVariationItem = await PostService.add({
                ...variation.itemId,
                parentId: productId,
                typeId: PostTypeId.ProductVariation,
                authorId: req.sessionAuth!.user!.userId.toString(),
                lastAuthorId: req.sessionAuth!.user!.userId.toString(),
                statusId: StatusId.Active,
                eCommerce: {
                    ...variation.itemId.eCommerce,
                    typeId: ProductTypeId.Simple
                }
            });
            variations.push({
                selectedVariations: variation.selectedVariations,
                rank: variation.rank,
                itemId: serviceResultVariationItem._id,
            });
        }

        apiResult.data = await PostService.add({
            ...reqData.body,
            _id: productId,
            typeId: PostTypeId.Product,
            authorId: req.sessionAuth!.user!.userId.toString(),
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
            eCommerce: {
                ...reqData.body.eCommerce,
                variations: variations
            }
        });

        await reply.status(apiResult.statusCode).send(apiResult);
    });
}

const updateWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostPutWithIdSchema;

        await PostService.update({
            ...reqData.params,
            ...reqData.body,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(apiResult.statusCode).send(apiResult);
    });
}

const updateProductWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostPutProductWithIdSchema;
        let serviceResultProduct = req.cachedServiceResult as IPostModel;

        if(serviceResultProduct.eCommerce){
            let variations: IPostECommerceVariationModel[] = [];

            // Delete removed variations
            let removedVariations: string[] = [];
            for(const variation of serviceResultProduct.eCommerce.variations ?? []) {
                if (!reqData.body.eCommerce.variations.some(productVariation => productVariation.itemId._id.toString() == variation.itemId.toString())) {
                    removedVariations.push(variation.itemId.toString());
                }
            }

            if(removedVariations.length > 0){
                await PostService.deleteMany({
                    _id: removedVariations,
                    typeId: PostTypeId.ProductVariation
                });
            }

            // Update variations or add new variations
            for(const variation of reqData.body.eCommerce.variations) {
                let variationItemId = variation.itemId._id;
                if(serviceResultProduct.eCommerce.variations?.some(productVariation => productVariation.itemId.toString() == variation.itemId._id.toString())){
                    await PostService.update({
                        ...variation.itemId,
                        typeId: PostTypeId.ProductVariation,
                        lastAuthorId: req.sessionAuth!.user!.userId.toString(),
                        eCommerce: {
                            ...variation.itemId.eCommerce,
                            typeId: ProductTypeId.Simple
                        }
                    });
                }else {
                    let serviceResultVariation = await PostService.add({
                        ...variation.itemId,
                        parentId: serviceResultProduct._id.toString(),
                        typeId: PostTypeId.ProductVariation,
                        authorId: req.sessionAuth!.user!.userId.toString(),
                        lastAuthorId: req.sessionAuth!.user!.userId.toString(),
                        eCommerce: {
                            ...variation.itemId.eCommerce,
                            typeId: ProductTypeId.Simple
                        }
                    });
                    variationItemId = serviceResultVariation._id.toString();
                }
                variations.push({
                    selectedVariations: variation.selectedVariations,
                    rank: variation.rank,
                    itemId: variationItemId,
                });
            }


            await PostService.update({
                ...reqData.params,
                ...reqData.body,
                typeId: PostTypeId.Product,
                lastAuthorId: req.sessionAuth!.user!.userId.toString(),
                eCommerce: {
                    ...reqData.body.eCommerce,
                    variations: variations
                }
            });
        }

        await reply.status(apiResult.statusCode).send(apiResult);
    });
}

const updateRankWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostPutRankWithIdSchema;

        await PostService.updateRank({
            ...reqData.body,
            ...reqData.params,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(apiResult.statusCode).send(apiResult);
    });
}

const updateViewWithId = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult<any>();

        let reqData = req as IPostPutViewWithIdSchema;

        apiResult.data = await PostService.updateView({
            ...reqData.params,
            ...reqData.body
        });

        await reply.status(apiResult.statusCode).send(apiResult);
    });
}

const updateStatusMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostPutStatusManySchema;

        await PostService.updateStatusMany({
            ...reqData.body,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        });

        await reply.status(apiResult.statusCode).send(apiResult);
    });
}

const deleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostDeleteManySchema;

        await PostService.deleteMany({
            ...reqData.body
        });

        await reply.status(apiResult.statusCode).send(apiResult);
    });
}

const deleteProductMany = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as IPostDeleteProductManySchema;

        await PostService.deleteMany({
            ...reqData.body,
            typeId: PostTypeId.Product
        });

        for (const _id of reqData.body._id) {
            await PostService.deleteMany({
                parentId: _id,
                typeId: PostTypeId.ProductVariation
            });
        }

        await reply.status(apiResult.statusCode).send(apiResult);
    });
}

export const PostController = {
    getWithId: getWithId,
    getMany: getMany,
    getWithURL: getWithURL,
    getPrevNextWithId: getPrevNextWithId,
    getCount: getCount,
    add: add,
    addProduct: addProduct,
    updateWithId: updateWithId,
    updateProductWithId: updateProductWithId,
    updateRankWithId: updateRankWithId,
    updateViewWithId: updateViewWithId,
    updateStatusMany: updateStatusMany,
    deleteMany: deleteMany,
    deleteProductMany: deleteProductMany
};