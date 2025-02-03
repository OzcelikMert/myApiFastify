import { FastifyReply, FastifyRequest } from 'fastify';
import { ApiResult } from '@library/api/result';
import { PostService } from '@services/post.service';
import { LogMiddleware } from '@middlewares/log.middleware';
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
} from '@schemas/post.schema';
import { PermissionUtil } from '@utils/permission.util';
import { UserRoleId } from '@constants/userRoles';
import {
  IPostGetDetailedResultService,
  IPostGetPrevNextResultService,
  IPostGetManyDetailedResultService,
} from 'types/services/post.service';
import {
  IPostECommerceVariationModel,
  IPostModel,
} from 'types/models/post.model';
import { PageTypeId } from '@constants/pageTypes';
import { PostTypeId } from '@constants/postTypes';
import { StatusId } from '@constants/status';
import { ProductTypeId } from '@constants/productTypes';
import { MongoDBHelpers } from '@library/mongodb/helpers';

const getWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<IPostGetDetailedResultService>();

    const reqData = req as IPostGetWithIdSchema;

    apiResult.data = await PostService.getDetailed({
      ...reqData.params,
      ...reqData.query,
      ...(!PermissionUtil.checkPermissionRoleRank(
        req.sessionAuth!.user!.roleId,
        UserRoleId.Editor
      )
        ? { authorId: req.sessionAuth!.user!.userId.toString() }
        : {}),
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<IPostGetManyDetailedResultService[]>();

    const reqData = req as IPostGetManySchema;

    apiResult.data = await PostService.getManyDetailed({
      ...reqData.query,
      ...(req.isFromAdminPanel &&
      !PermissionUtil.checkPermissionRoleRank(
        req.sessionAuth!.user!.roleId,
        UserRoleId.Editor
      )
        ? { authorId: req.sessionAuth!.user!.userId.toString() }
        : {}),
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const getWithURL = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<IPostGetDetailedResultService>();

    const reqData = req as IPostGetWithURLSchema;

    apiResult.data = await PostService.getDetailed({
      ...reqData.params,
      ...reqData.query,
      url:
        reqData.query.pageTypeId &&
        reqData.query.pageTypeId != PageTypeId.Default
          ? undefined
          : reqData.params.url,
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const getPrevNextWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<{
      prev?: IPostGetPrevNextResultService | null;
      next?: IPostGetPrevNextResultService | null;
    }>();

    const reqData = req as IPostGetPrevNextWithURLSchema;

    apiResult.data = {
      prev: await PostService.getPrevNext({
        ...reqData.query,
        prevId: reqData.params._id,
      }),
      next: await PostService.getPrevNext({
        ...reqData.query,
        nextId: reqData.params._id,
      }),
    };

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const getCount = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<number>();

    const reqData = req as IPostGetCountSchema;

    apiResult.data = await PostService.getCount({
      ...reqData.query,
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const add = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<IPostModel>();

    const reqData = req as IPostPostSchema;

    apiResult.data = await PostService.add({
      ...reqData.body,
      authorId: req.sessionAuth!.user!.userId.toString(),
      lastAuthorId: req.sessionAuth!.user!.userId.toString(),
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const addProduct = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<IPostModel>();

    const reqData = req as IPostPostProductSchema;

    const mainProductId = MongoDBHelpers.createObjectId().toString();
    const variations: IPostECommerceVariationModel[] = [];

    for (const variation of reqData.body.eCommerce.variations) {
      const serviceResultVariationItem = await PostService.add({
        ...variation.product,
        parentId: mainProductId,
        typeId: PostTypeId.ProductVariation,
        authorId: req.sessionAuth!.user!.userId.toString(),
        lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        statusId: StatusId.Active,
        eCommerce: {
          ...variation.product.eCommerce,
          typeId: ProductTypeId.Simple,
        },
      });
      variations.push({
        options: variation.options,
        productId: serviceResultVariationItem._id,
      });
    }

    apiResult.data = await PostService.add({
      ...reqData.body,
      _id: mainProductId,
      typeId: PostTypeId.Product,
      authorId: req.sessionAuth!.user!.userId.toString(),
      lastAuthorId: req.sessionAuth!.user!.userId.toString(),
      eCommerce: {
        ...reqData.body.eCommerce,
        variations: variations,
      },
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updateWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IPostPutWithIdSchema;

    await PostService.update({
      ...reqData.params,
      ...reqData.body,
      lastAuthorId: req.sessionAuth!.user!.userId.toString(),
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updateProductWithId = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IPostPutProductWithIdSchema;
    const serviceResultProduct = req.cachedServiceResult as IPostModel;

    if (serviceResultProduct.eCommerce) {
      const variations: IPostECommerceVariationModel[] = [];

      // Delete removed variations
      const removedVariations: string[] = [];
      for (const variation of serviceResultProduct.eCommerce.variations ?? []) {
        if (
          !reqData.body.eCommerce.variations.some(
            (newProductVariation) =>
              newProductVariation.product._id?.toString() ==
              variation.productId.toString()
          )
        ) {
          removedVariations.push(variation.productId.toString());
        }
      }

      if (removedVariations.length > 0) {
        await PostService.deleteMany({
          _id: removedVariations,
          typeId: PostTypeId.ProductVariation,
        });
      }

      // Update variations or add new variations
      for (const newVariation of reqData.body.eCommerce.variations) {
        let newVariationProductId = newVariation.product._id ?? "";
        if (
          serviceResultProduct.eCommerce.variations?.some(
            (productVariation) =>
              productVariation.productId.toString() ==
              newVariationProductId.toString()
          )
        ) {
          await PostService.update({
            ...newVariation.product,
            _id: newVariationProductId,
            parentId: serviceResultProduct._id.toString(),
            typeId: PostTypeId.ProductVariation,
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
            eCommerce: {
              ...newVariation.product.eCommerce,
              typeId: ProductTypeId.Simple,
            },
          });
        } else {
          const serviceResultVariation = await PostService.add({
            ...newVariation.product,
            parentId: serviceResultProduct._id.toString(),
            typeId: PostTypeId.ProductVariation,
            authorId: req.sessionAuth!.user!.userId.toString(),
            lastAuthorId: req.sessionAuth!.user!.userId.toString(),
            eCommerce: {
              ...newVariation.product.eCommerce,
              typeId: ProductTypeId.Simple,
            },
          });
          newVariationProductId = serviceResultVariation._id.toString();
        }
        variations.push({
          options: newVariation.options,
          productId: newVariationProductId,
        });
      }

      await PostService.update({
        ...reqData.params,
        ...reqData.body,
        typeId: PostTypeId.Product,
        lastAuthorId: req.sessionAuth!.user!.userId.toString(),
        eCommerce: {
          ...reqData.body.eCommerce,
          variations: variations,
        },
      });
    }

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updateRankWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IPostPutRankWithIdSchema;

    await PostService.updateRank({
      ...reqData.body,
      ...reqData.params,
      lastAuthorId: req.sessionAuth!.user!.userId.toString(),
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updateViewWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<any>();

    const reqData = req as IPostPutViewWithIdSchema;

    apiResult.data = await PostService.updateView({
      ...reqData.params,
      ...reqData.body,
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updateStatusMany = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IPostPutStatusManySchema;

    await PostService.updateStatusMany({
      ...reqData.body,
      lastAuthorId: req.sessionAuth!.user!.userId.toString(),
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const deleteMany = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IPostDeleteManySchema;

    await PostService.deleteMany({
      ...reqData.body,
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const deleteProductMany = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as IPostDeleteProductManySchema;

    await PostService.deleteMany({
      ...reqData.body,
      typeId: PostTypeId.Product,
    });

    for (const _id of reqData.body._id) {
      await PostService.deleteMany({
        parentId: _id,
        typeId: PostTypeId.ProductVariation,
      });
    }

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

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
  deleteProductMany: deleteProductMany,
};
