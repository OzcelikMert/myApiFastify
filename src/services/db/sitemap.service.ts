import * as mongoose from 'mongoose';
import { postModel } from '@models/post.model';
import { IPostModel } from 'types/models/post.model';
import { MongoDBHelpers } from '@library/mongodb/helpers';
import { postObjectIdKeys } from '@constants/objectIdKeys/post.objectIdKeys';
import { StatusId } from '@constants/status';
import { postTermObjectIdKeys } from '@constants/objectIdKeys/postTerm.objectIdKeys';
import { postTermModel } from '@models/postTerm.model';
import {
  ISitemapGetPostCountParamService,
  ISitemapGetPostCountResultService,
  ISitemapGetPostParamService,
  ISitemapGetPostResultService,
  ISitemapGetPostTermCountParamService,
  ISitemapGetPostTermCountResultService,
  ISitemapGetPostTermParamService,
  ISitemapGetPostTermResultService,
} from 'types/services/db/sitemap.service';

export const sitemapLimit = 500;

const getPost = async (params: ISitemapGetPostParamService) => {
  let filters: mongoose.FilterQuery<IPostModel> = {
    statusId: StatusId.Active,
    $or: [{ isNoIndex: false }, { isNoIndex: null }],
  };
  params = MongoDBHelpers.convertToObjectIdData(params, postObjectIdKeys);

  if (params.typeId) {
    filters = {
      ...filters,
      typeId: params.typeId,
    };
  }

  const query = postModel.find(filters);

  query.sort({ _id: 'desc' });

  query.skip(
    sitemapLimit * (params.page && params.page > 0 ? params.page - 1 : 0)
  );
  query.limit(sitemapLimit);

  return (await query.lean<ISitemapGetPostResultService[]>().exec()).map(
    (doc) => {
      return {
        updatedAt: doc.updatedAt,
        createdAt: doc.createdAt,
        typeId: doc.typeId,
        pageTypeId: doc.pageTypeId,
        contents: doc.contents.map((content) => ({
          langId: content.langId,
          title: content.title,
          url: content.url,
        })),
      };
    }
  );
};

const getPostCount = async (params: ISitemapGetPostCountParamService) => {
  let filters: mongoose.FilterQuery<IPostModel> = {
    statusId: StatusId.Active,
    $or: [{ isNoIndex: false }, { isNoIndex: null }],
  };
  params = MongoDBHelpers.convertToObjectIdData(params, postObjectIdKeys);

  if (params.typeId) {
    filters = {
      ...filters,
      typeId: { $in: params.typeId },
    };
  }

  const query = postModel.aggregate([
    {
      $match: filters,
    },
    {
      $group: {
        _id: '$typeId',
        total: { $sum: 1 },
      },
    },
  ]);

  query.sort({ _id: 'asc' });

  return (await query.exec()).map((doc) => {
    return {
      typeId: doc._id,
      total: doc.total,
    };
  }) as ISitemapGetPostCountResultService[];
};

const getPostTerm = async (params: ISitemapGetPostTermParamService) => {
  let filters: mongoose.FilterQuery<IPostModel> = {
    statusId: StatusId.Active,
    $or: [{ isNoIndex: false }, { isNoIndex: null }],
  };
  params = MongoDBHelpers.convertToObjectIdData(params, postTermObjectIdKeys);

  if (params.typeId) {
    filters = {
      ...filters,
      typeId: params.typeId,
    };
  }
  if (params.postTypeId) {
    filters = {
      ...filters,
      postTypeId: params.postTypeId,
    };
  }

  const query = postTermModel.find(filters);

  query.sort({ _id: 'desc' });

  query.skip(
    sitemapLimit * (params.page && params.page > 0 ? params.page - 1 : 0)
  );
  query.limit(sitemapLimit);

  return (await query.lean<ISitemapGetPostTermResultService[]>().exec()).map(
    (doc) => {
      return {
        updatedAt: doc.updatedAt,
        createdAt: doc.createdAt,
        typeId: doc.typeId,
        postTypeId: doc.postTypeId,
        contents: doc.contents.map((content) => ({
          langId: content.langId,
          title: content.title,
          url: content.url,
        })),
      };
    }
  );
};

const getPostTermCount = async (
  params: ISitemapGetPostTermCountParamService
) => {
  let filters: mongoose.FilterQuery<IPostModel> = {
    statusId: StatusId.Active,
    $or: [{ isNoIndex: false }, { isNoIndex: null }],
  };
  params = MongoDBHelpers.convertToObjectIdData(params, postObjectIdKeys);

  if (params.typeId) {
    filters = {
      ...filters,
      typeId: { $in: params.typeId },
    };
  }
  if (params.postTypeId) {
    filters = {
      ...filters,
      postTypeId: { $in: params.postTypeId },
    };
  }

  const query = postTermModel.aggregate([
    {
      $match: filters,
    },
    {
      $group: {
        _id: { postTypeId: '$postTypeId', typeId: '$typeId' },
        total: { $sum: 1 },
      },
    },
  ]);

  query.sort({ _id: 'asc' });

  return (await query.exec()).map((doc) => {
    return {
      typeId: doc._id.typeId,
      postTypeId: doc._id.postTypeId,
      total: doc.total,
    };
  }) as ISitemapGetPostTermCountResultService[];
};

export const SitemapService = {
  getPost: getPost,
  getPostCount: getPostCount,
  getPostTerm: getPostTerm,
  getPostTermCount: getPostTermCount,
};
