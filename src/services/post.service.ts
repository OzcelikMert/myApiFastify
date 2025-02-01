import * as mongoose from 'mongoose';
import { postModel } from '@models/post.model';
import {
  IPostAddParamService,
  IPostDeleteManyParamService,
  IPostGetCountParamService,
  IPostGetManyParamService,
  IPostGetManyDetailedResultService,
  IPostGetParamService,
  IPostGetPrevNextParamService,
  IPostGetPrevNextResultService,
  IPostGetDetailedResultService,
  IPostUpdateParamService,
  IPostUpdateRankParamService,
  IPostUpdateStatusManyParamService,
  IPostUpdateViewParamService,
  IPostGetDetailedParamService,
  IPostGetManyDetailedParamService,
} from 'types/services/post.service';
import { IPostModel } from 'types/models/post.model';
import { MongoDBHelpers } from '@library/mongodb/helpers';
import { VariableLibrary } from '@library/variable';
import { Config } from '@configs/index';
import { postObjectIdKeys } from '@constants/objectIdKeys/post.objectIdKeys';
import { StatusId } from '@constants/status';
import { PostTermTypeId } from '@constants/postTermTypes';
import { PostTypeId } from '@constants/postTypes';
import { IComponentGetDetailedResultService } from 'types/services/component.service';
import { PostSortTypeId } from '@constants/postSortTypes';
import { IPostTermGetDetailedResultService } from 'types/services/postTerm.service';
import { authorPopulationSelect } from './user.service';

const createURL = async (
  _id: string | null,
  title: string,
  typeId: PostTypeId
) => {
  let urlAlreadyCount = 2;
  let url = title.convertSEOUrl();

  const oldUrl = url;
  while (
    await get({
      ignorePostId: _id ? [_id] : undefined,
      url: url,
      typeId: typeId,
    })
  ) {
    url = `${oldUrl}-${urlAlreadyCount}`;
    urlAlreadyCount++;
  }

  return url;
};

const transformContents = (doc: IPostTermGetDetailedResultService, langId?: string, removeContent?: boolean) => {
  const defaultLangId = MongoDBHelpers.convertToObjectId(Config.defaultLangId);

  if (doc && Array.isArray(doc.contents)) {
    doc.contents =
      doc.contents.findSingle('langId', langId) ??
      doc.contents.findSingle('langId', defaultLangId);

      if(removeContent){
        delete doc.contents?.content;
      }
  }
  return doc;
};

const authorPopulation = {
  path: ['author', 'lastAuthor', 'authors'].join(' '),
  select: authorPopulationSelect,
  options: { omitUndefined: true },
};

const get = async (params: IPostGetParamService) => {
  let filters: mongoose.FilterQuery<IPostModel> = {};
  params = MongoDBHelpers.convertToObjectIdData(params, [
    ...postObjectIdKeys,
    'ignorePostId',
  ]);
  const defaultLangId = MongoDBHelpers.convertToObjectId(Config.defaultLangId);

  if (params._id)
    filters = {
      ...filters,
      _id: params._id,
    };
  if (params.authorId)
    filters = {
      ...filters,
      $or: [
        { authorId: params.authorId },
        { authors: { $in: params.authorId } },
      ],
    };
  if (params.url)
    filters = {
      ...filters,
      'contents.url': params.url,
      'contents.langId': { $in: [params.langId, defaultLangId] },
    };
  if (params.typeId) {
    filters = {
      ...filters,
      typeId: params.typeId,
    };
  }
  if (params.pageTypeId)
    filters = {
      ...filters,
      pageTypeId: params.pageTypeId,
    };
  if (params.statusId)
    filters = {
      ...filters,
      statusId: params.statusId,
    };
  if (params.ignorePostId) {
    filters = {
      ...filters,
      _id: { $nin: params.ignorePostId },
    };
  }

  const query = postModel.findOne(filters);

  query.sort({ isFixed: 'desc', rank: 'asc', _id: 'desc' });

  const doc = await query.lean<IPostModel>().exec();

  if (doc) {
    doc.contents = [];
  }

  return doc;
};

const getMany = async (params: IPostGetManyParamService) => {
  let filters: mongoose.FilterQuery<IPostModel> = {};
  params = MongoDBHelpers.convertToObjectIdData(params, [
    ...postObjectIdKeys,
    'ignorePostId',
  ]);
  const defaultLangId = MongoDBHelpers.convertToObjectId(Config.defaultLangId);

  if (params._id)
    filters = {
      ...filters,
      _id: { $in: params._id },
    };
  if (params.authorId)
    filters = {
      ...filters,
      $or: [
        { authorId: params.authorId },
        { authors: { $in: params.authorId } },
      ],
    };
  if (params.title)
    filters = {
      ...filters,
      'contents.title': { $regex: new RegExp(params.title, 'i') },
    };
  if (params.typeId)
    filters = {
      ...filters,
      typeId: { $in: params.typeId },
    };
  if (params.pageTypeId)
    filters = {
      ...filters,
      pageTypeId: { $in: params.pageTypeId },
    };
  if (params.statusId)
    filters = {
      ...filters,
      statusId: params.statusId,
    };
  if (params.ignorePostId)
    filters = {
      ...filters,
      _id: { $nin: params.ignorePostId },
    };
  if (params.categories)
    filters = {
      ...filters,
      categories: { $in: params.categories },
    };
  if (params.tags)
    filters = {
      ...filters,
      tags: { $in: params.tags },
    };
  if (params.dateStart) {
    params.dateStart.setHours(0, 0, 0, 0);
    filters = {
      ...filters,
      dateStart: { $lt: params.dateStart },
    };
  }

  const query = postModel.find(filters);

  query.sort({ isFixed: 'desc', rank: 'asc', _id: 'desc' });

  const docs = await query.lean<IPostModel[]>().exec();

  return docs.map((doc) => {
    doc.contents = [];

    return doc;
  });
};

const getDetailed = async (params: IPostGetDetailedParamService) => {
  let filters: mongoose.FilterQuery<IPostModel> = {};
  params = MongoDBHelpers.convertToObjectIdData(params, [
    ...postObjectIdKeys,
    'ignorePostId',
  ]);
  const defaultLangId = MongoDBHelpers.convertToObjectId(Config.defaultLangId);
  let views = 0;

  if (params._id)
    filters = {
      ...filters,
      _id: params._id,
    };
  if (params.authorId)
    filters = {
      ...filters,
      $or: [
        { authorId: params.authorId },
        { authors: { $in: params.authorId } },
      ],
    };
  if (params.url)
    filters = {
      ...filters,
      'contents.url': params.url,
      'contents.langId': { $in: [params.langId, defaultLangId] },
    };
  if (params.typeId) {
    filters = {
      ...filters,
      typeId: params.typeId,
    };
  }
  if (params.pageTypeId)
    filters = {
      ...filters,
      pageTypeId: params.pageTypeId,
    };
  if (params.statusId)
    filters = {
      ...filters,
      statusId: params.statusId,
    };
  if (params.ignorePostId) {
    filters = {
      ...filters,
      _id: { $nin: params.ignorePostId },
    };
  }

  const query = postModel.findOne(filters);

  query.populate({
    path: ['categories', 'tags'].join(' '),
    select: '_id typeId postTypeId contents',
    match: {
      typeId: { $in: [PostTermTypeId.Category, PostTermTypeId.Tag] },
      statusId: StatusId.Active,
      postTypeId: params.typeId,
    },
    options: { omitUndefined: true },
    transform: doc => transformContents(doc, params.langId, true),
  });

  query.populate(authorPopulation);

  query.populate({
    path: "contents.lang",
    match: {
      _id: params.langId ?? defaultLangId,
      statusId: StatusId.Active
    }
  });

  switch (params.typeId) {
    case PostTypeId.Product:
      query.populate({
        path: [
          'eCommerce.attributes.attributeTerm',
          'eCommerce.attributes.variationTerms',
          'eCommerce.variations.options.variationTerm',
          'eCommerce.defaultVariationOptions.variationTerm',
        ].join(' '),
        select: '_id typeId postTypeId contents',
        match: {
          typeId: {
            $in: [PostTermTypeId.Attributes, PostTermTypeId.Variations],
          },
          statusId: StatusId.Active,
          postTypeId: PostTypeId.Product,
        },
        options: { omitUndefined: true },
        transform: doc => transformContents(doc, params.langId, true),
      });

      query.populate({
        path: 'eCommerce.variations.product',
        options: { omitUndefined: true },
        transform: (doc: IPostGetDetailedResultService) => {
          if (doc) {
            if (Array.isArray(doc.contents)) {
              let views = 0;

              doc.alternates = doc.contents.map((content) => {
                views += content.views ?? 0;

                return {
                  langId: content.langId.toString(),
                  title: content.title,
                  url: content.url,
                };
              });

              doc.contents =
                doc.contents.findSingle('langId', params.langId) ??
                doc.contents.findSingle('langId', defaultLangId);
              delete doc.contents?.content;

              doc.views = views;
            }
          }
          return doc;
        },
        populate: authorPopulation
      });
      break;
  }

  query.sort({ isFixed: 'desc', rank: 'asc', _id: 'desc' });

  const doc = await query.lean<IPostGetDetailedResultService>().exec();

  if (doc) {
    if (doc.categories) {
      doc.categories = doc.categories.filter((item) => item);
    }

    if (doc.tags) {
      doc.tags = doc.tags.filter((item) => item);
    }

    if (Array.isArray(doc.contents)) {
      doc.alternates = doc.contents.map((content) => ({
        langId: content.langId.toString(),
        title: content.title ?? '',
        url: content.url ?? '',
      }));

      for (const docContent of doc.contents) {
        if (docContent.views) {
          views += Number(docContent.views);
        }
      }

      const docContent =
        doc.contents.findSingle('langId', params.langId) ??
        doc.contents.findSingle('langId', defaultLangId);
      if (
        docContent &&
        docContent.langId.toString() != params.langId?.toString()
      ) {
        docContent.views = 0;
      }

      doc.contents = docContent;
    }

    if (doc.eCommerce) {
      if (doc.eCommerce.variations) {
        for (const docECommerceVariationItem of doc.eCommerce.variations) {
          docECommerceVariationItem.options =
            docECommerceVariationItem.options.filter(
              (item) => item.attributeId
            );
        }
      }

      if (doc.eCommerce.defaultVariationOptions) {
        doc.eCommerce.defaultVariationOptions =
          doc.eCommerce.defaultVariationOptions.filter(
            (item) => item.attributeId
          );
      }

      if (doc.eCommerce.attributes) {
        doc.eCommerce.attributes = doc.eCommerce.attributes.filter(
          (item) => item.attributeTermId
        );
      }
    }

    doc.views = views;

    return doc;
  }

  return null;
};

const getManyDetailed = async (params: IPostGetManyDetailedParamService) => {
  let filters: mongoose.FilterQuery<IPostModel> = {};
  params = MongoDBHelpers.convertToObjectIdData(params, [
    ...postObjectIdKeys,
    'ignorePostId',
  ]);
  const defaultLangId = MongoDBHelpers.convertToObjectId(Config.defaultLangId);

  if (params._id)
    filters = {
      ...filters,
      _id: { $in: params._id },
    };
  if (params.authorId)
    filters = {
      ...filters,
      $or: [
        { authorId: params.authorId },
        { authors: { $in: params.authorId } },
      ],
    };
  if (params.title)
    filters = {
      ...filters,
      'contents.title': { $regex: new RegExp(params.title, 'i') },
    };
  if (params.typeId)
    filters = {
      ...filters,
      typeId: { $in: params.typeId },
    };
  if (params.pageTypeId)
    filters = {
      ...filters,
      pageTypeId: { $in: params.pageTypeId },
    };
  if (params.statusId)
    filters = {
      ...filters,
      statusId: params.statusId,
    };
  if (params.ignorePostId)
    filters = {
      ...filters,
      _id: { $nin: params.ignorePostId },
    };
  if (params.categories)
    filters = {
      ...filters,
      categories: { $in: params.categories },
    };
  if (params.tags)
    filters = {
      ...filters,
      tags: { $in: params.tags },
    };
  if (params.dateStart) {
    params.dateStart.setHours(0, 0, 0, 0);
    filters = {
      ...filters,
      dateStart: { $lt: params.dateStart },
    };
  }

  const query = postModel.find(filters);

  query.populate({
    path: ['categories', 'tags'].join(' '),
    select: '_id typeId postTypeId contents',
    match: {
      typeId: { $in: [PostTermTypeId.Category, PostTermTypeId.Tag] },
      statusId: StatusId.Active,
      postTypeId: { $in: params.typeId },
    },
    options: { omitUndefined: true },
    transform: doc => transformContents(doc, params.langId, true),
  });

  query.populate(authorPopulation);

  query.populate({
    path: "contents.lang",
    match: {
      _id: params.langId ?? defaultLangId,
      statusId: StatusId.Active
    }
  });

  if (params.typeId) {
    if (params.typeId.includes(PostTypeId.Product)) {
      query.populate({
        path: 'eCommerce.variations.product',
        transform: (doc: IPostGetDetailedResultService) => {
          if (doc) {
            if (Array.isArray(doc.contents)) {
              let views = 0;

              doc.alternates = doc.contents.map((content) => {
                views += content.views ?? 0;

                return {
                  langId: content.langId.toString(),
                  title: content.title,
                  url: content.url,
                };
              });

              doc.contents =
                doc.contents.findSingle('langId', params.langId) ??
                doc.contents.findSingle('langId', defaultLangId);
              delete doc.contents?.content;

              doc.views = views;
            }
          }
          return doc;
        },
        populate: authorPopulation
      });
    }
  }

  switch (params.sortTypeId) {
    case PostSortTypeId.Newest:
      query.sort({ _id: 'desc' });
      break;
    case PostSortTypeId.Oldest:
      query.sort({ _id: 'asc' });
      break;
    case PostSortTypeId.MostPopular:
      query.sort({ views: 'desc', _id: 'desc' });
      break;
    default:
      query.sort({ isFixed: 'desc', rank: 'asc', _id: 'desc' });
      break;
  }

  if (params.page)
    query.skip((params.count ?? 10) * (params.page > 0 ? params.page - 1 : 0));
  if (params.count) query.limit(params.count);

  const docs = await query.lean<IPostGetManyDetailedResultService[]>().exec();

  return docs.map((doc) => {
    let views = 0;

    if (doc.categories) {
      doc.categories = doc.categories.filter((item) => item);
    }

    if (doc.tags) {
      doc.tags = doc.tags.filter((item) => item);
    }

    if (Array.isArray(doc.contents)) {
      doc.alternates = doc.contents.map((content) => ({
        langId: content.langId.toString(),
        title: content.title,
        url: content.url,
      }));

      for (const docContent of doc.contents) {
        if (docContent.views) {
          views += Number(docContent.views);
        }
      }

      let docContent = doc.contents.findSingle('langId', params.langId);
      if (!docContent) {
        docContent = doc.contents.findSingle('langId', defaultLangId);
        if (docContent) {
          docContent.views = 0;
        }
      }

      doc.contents = docContent;
      delete doc.contents?.content;
    }

    if (doc.eCommerce) {
      if (doc.eCommerce.variations) {
        doc.eCommerce.variations = doc.eCommerce.variations.filter(
          (variation) => {
            return variation.options.every((option) => {
              return doc.eCommerce?.defaultVariationOptions?.some(
                (defaultVariationOption) => {
                  return (
                    defaultVariationOption.attributeId.toString() ==
                      option.attributeId.toString() &&
                    defaultVariationOption.variationTermId.toString() ==
                      option.variationTermId.toString()
                  );
                }
              );
            });
          }
        );
      }
    }

    doc.views = views;

    return doc;
  });
};

const getPrevNext = async (params: IPostGetPrevNextParamService) => {
  let filters: mongoose.FilterQuery<IPostModel> = {};
  params = MongoDBHelpers.convertToObjectIdData(params, [
    ...postObjectIdKeys,
    'ignorePostId',
  ]);
  const defaultLangId = MongoDBHelpers.convertToObjectId(Config.defaultLangId);
  let sortTypeId: PostSortTypeId = PostSortTypeId.Newest;

  if (params.authorId)
    filters = {
      ...filters,
      $or: [
        { authorId: params.authorId },
        { authors: { $in: params.authorId } },
      ],
    };
  if (params.typeId)
    filters = {
      ...filters,
      typeId: { $in: params.typeId },
    };
  if (params.statusId)
    filters = {
      ...filters,
      statusId: params.statusId,
    };
  if (params.categories)
    filters = {
      ...filters,
      categories: { $in: params.categories },
    };
  if (params.tags)
    filters = {
      ...filters,
      tags: { $in: params.tags },
    };
  if (params.prevId) {
    filters = {
      ...filters,
      _id: { $lt: params.prevId },
    };
  }
  if (params.nextId) {
    filters = {
      ...filters,
      _id: { $gt: params.nextId },
    };
    sortTypeId = PostSortTypeId.Oldest;
  }

  const query = postModel.findOne(
    filters,
    '_id contents._id contents.langId contents.title contents.url contents.image createdAt'
  );

  switch (sortTypeId) {
    case PostSortTypeId.Newest:
      query.sort({ _id: 'desc' });
      break;
    case PostSortTypeId.Oldest:
      query.sort({ _id: 'asc' });
      break;
  }

  const doc = await query.lean<IPostGetPrevNextResultService>().exec();

  if (doc) {
    if (Array.isArray(doc.contents)) {
      doc.contents =
        doc.contents.findSingle('langId', params.langId) ??
        doc.contents.findSingle('langId', defaultLangId);
    }
  }

  return doc;
};

const getCount = async (params: IPostGetCountParamService) => {
  let filters: mongoose.FilterQuery<IPostModel> = { statusId: StatusId.Active };
  params = MongoDBHelpers.convertToObjectIdData(params, postObjectIdKeys);

  if (params.typeId)
    filters = {
      ...filters,
      typeId: params.typeId,
    };
  if (params.statusId)
    filters = {
      ...filters,
      statusId: params.statusId,
    };
  if (params.authorId)
    filters = {
      ...filters,
      $or: [
        { authorId: params.authorId },
        { authors: { $in: params.authorId } },
      ],
    };
  if (params.title)
    filters = {
      ...filters,
      'contents.title': { $regex: new RegExp(params.title, 'i') },
    };
  if (params.categories) {
    filters = {
      ...filters,
      categories: { $in: params.categories },
    };
  }

  const query = postModel.find(filters);

  return await query.countDocuments().exec();
};

const add = async (params: IPostAddParamService) => {
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(params, postObjectIdKeys);

  if (params.contents) {
    params.contents.url = await createURL(
      null,
      params.contents.title ?? '',
      params.typeId
    );
  }

  if (params.dateStart) {
    params.dateStart = new Date(params.dateStart);
  }

  return (await postModel.create(params)).toObject();
};

const update = async (params: IPostUpdateParamService) => {
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(params, postObjectIdKeys);

  let filters: mongoose.FilterQuery<IPostModel> = {};

  if (params._id) {
    filters = {
      _id: params._id,
    };
  }
  if (params.typeId) {
    filters = {
      ...filters,
      typeId: params.typeId,
    };
  }

  let doc = await postModel.findOne(filters).exec();

  if (doc) {
    if (params.contents) {
      if (Array.isArray(doc.contents)) {
        let docContent = doc.contents.findSingle(
          'langId',
          params.contents.langId
        );
        if (docContent) {
          if (docContent.title != params.contents.title) {
            params.contents.url = await createURL(
              doc._id.toString(),
              params.contents.title ?? '',
              params.typeId
            );
          }
          docContent = Object.assign(docContent, params.contents);
        } else {
          params.contents.url = await createURL(
            doc._id.toString(),
            params.contents.title ?? '',
            params.typeId
          );
          doc.contents.push(params.contents);
        }
      }
      delete params.contents;
    }

    if (params.eCommerce) {
    }

    if (params.dateStart) {
      params.dateStart = new Date(params.dateStart);
    }

    doc = Object.assign(doc, params);

    await doc.save();
  }

  return {
    _id: doc?._id,
    pageTypeId: doc?.pageTypeId,
    lastAuthorId: doc?.lastAuthorId,
  };
};

const updateRank = async (params: IPostUpdateRankParamService) => {
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(params, postObjectIdKeys);

  let filters: mongoose.FilterQuery<IPostModel> = {};

  if (params._id) {
    filters = {
      ...filters,
      _id: params._id,
    };
  }
  if (params.typeId) {
    filters = {
      ...filters,
      typeId: params.typeId,
    };
  }

  const doc = await postModel.findOne(filters).exec();

  if (doc) {
    doc.rank = params.rank;
    doc.lastAuthorId = params.lastAuthorId;

    await doc.save();
  }

  return {
    _id: doc?._id,
    rank: doc?.rank,
    lastAuthorId: doc?.lastAuthorId,
  };
};

const updateView = async (params: IPostUpdateViewParamService) => {
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(params, postObjectIdKeys);
  const defaultLangId = MongoDBHelpers.convertToObjectId(Config.defaultLangId);

  let filters: mongoose.FilterQuery<IPostModel> = {};

  if (params._id) {
    filters = {
      _id: params._id,
    };
  }
  if (params.typeId) {
    filters = {
      ...filters,
      typeId: params.typeId,
    };
  }

  const doc = await postModel.findOne(filters).exec();

  let views = 0,
    totalViews = 0;
  if (doc) {
    const docContent =
      doc.contents.findSingle('langId', params.langId) ??
      doc.contents.findSingle('langId', defaultLangId);

    if (docContent) {
      if (docContent.views) {
        docContent.views = Number(docContent.views) + 1;
      } else {
        docContent.views = 1;
      }

      views = docContent.views;

      await doc.save();
    }

    for (const docContent of doc.contents) {
      if (docContent.views) {
        totalViews += Number(docContent.views);
      }
    }
  }

  return {
    _id: doc?._id,
    langId: params.langId,
    views: views,
    totalViews: totalViews,
  };
};

const updateStatusMany = async (params: IPostUpdateStatusManyParamService) => {
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(params, postObjectIdKeys);

  let filters: mongoose.FilterQuery<IPostModel> = {};

  if (params._id) {
    filters = {
      ...filters,
      _id: { $in: params._id },
    };
  }
  if (params.typeId) {
    filters = {
      ...filters,
      typeId: params.typeId,
    };
  }

  const docs = await postModel.find(filters).exec();

  return await Promise.all(
    docs.map(async (doc) => {
      doc.statusId = params.statusId;

      if (params.lastAuthorId) {
        doc.lastAuthorId = params.lastAuthorId;
      }

      await doc.save();

      return {
        _id: doc._id,
        statusId: doc.statusId,
        lastAuthorId: doc.lastAuthorId,
      };
    })
  );
};

const deleteMany = async (params: IPostDeleteManyParamService) => {
  let filters: mongoose.FilterQuery<IPostModel> = {};
  params = MongoDBHelpers.convertToObjectIdData(params, postObjectIdKeys);

  if (params._id) {
    filters = {
      ...filters,
      _id: { $in: params._id },
    };
  }
  if (params.parentId) {
    filters = {
      ...filters,
      parentId: params.parentId,
    };
  }
  if (params.typeId) {
    filters = {
      ...filters,
      typeId: params.typeId,
    };
  }

  return (await postModel.deleteMany(filters).exec()).deletedCount;
};

export const PostService = {
  get: get,
  getMany: getMany,
  getDetailed: getDetailed,
  getManyDetailed: getManyDetailed,
  getPrevNext: getPrevNext,
  getCount: getCount,
  add: add,
  update: update,
  updateRank: updateRank,
  updateView: updateView,
  updateStatusMany: updateStatusMany,
  deleteMany: deleteMany,
};
