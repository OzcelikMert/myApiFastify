import * as mongoose from 'mongoose';
import { MongoDBHelpers } from '@library/mongodb/helpers';
import { VariableLibrary } from '@library/variable';
import {
  IPostCommentAddParamService,
  IPostCommentDeleteManyParamService,
  IPostCommentGetDetailedManyParamService,
  IPostCommentGetDetailedParamService,
  IPostCommentGetManyParamService,
  IPostCommentGetParamService,
  IPostCommentGetDetailedResultService,
  IPostCommentUpdateLikeParamService,
  IPostCommentUpdateParamService,
  IPostCommentUpdateStatusManyParamService,
} from 'types/services/postComponent.service';
import { IPostCommentModel } from 'types/models/postComment.model';
import { postCommentObjectIdKeys } from '@constants/objectIdKeys/postComment.objectIdKeys';
import { postCommentModel } from '@models/postComment.model';
import { PopulationSelects } from '@constants/populationSelects';

const authorPopulation = {
  path: ['author', 'lastAuthor'].join(' '),
  select: PopulationSelects.author,
  options: { omitUndefined: true },
};

const get = async (params: IPostCommentGetParamService) => {
  let filters: mongoose.FilterQuery<IPostCommentModel> = {};
  params = MongoDBHelpers.convertToObjectIdData(
    params,
    postCommentObjectIdKeys
  );

  if (params._id)
    filters = {
      ...filters,
      _id: params._id,
    };
  if (params.postId)
    filters = {
      ...filters,
      postId: params.postId,
    };
  if (params.postTypeId)
    filters = {
      ...filters,
      postTypeId: params.postTypeId,
    };
  if (params.statusId)
    filters = {
      ...filters,
      statusId: params.statusId,
    };
  if (params.authorId)
    filters = {
      ...filters,
      authorId: params.authorId,
    };

  const query = postCommentModel.findOne(filters);

  query.sort({ _id: 'desc' });

  const doc = await query.lean<IPostCommentModel>().exec();

  if (doc) {
  }

  return doc;
};

const getMany = async (params: IPostCommentGetManyParamService) => {
  let filters: mongoose.FilterQuery<IPostCommentModel> = {};
  params = MongoDBHelpers.convertToObjectIdData(
    params,
    postCommentObjectIdKeys
  );

  if (params._id)
    filters = {
      ...filters,
      _id: { $in: params._id },
    };
  if (params.postId)
    filters = {
      ...filters,
      postId: params.postId,
    };
  if (params.postTypeId)
    filters = {
      ...filters,
      postTypeId: params.postTypeId,
    };
  if (params.statusId)
    filters = {
      ...filters,
      statusId: params.statusId,
    };
  if (params.authorId)
    filters = {
      ...filters,
      authorId: params.authorId,
    };

  const query = postCommentModel.find(filters);

  query.sort({ _id: 'desc' });

  const docs = await query.lean<IPostCommentModel[]>().exec();

  return docs.map((doc) => {
    return doc;
  });
};

const getDetailed = async (params: IPostCommentGetDetailedParamService) => {
  let filters: mongoose.FilterQuery<IPostCommentModel> = {};
  params = MongoDBHelpers.convertToObjectIdData(
    params,
    postCommentObjectIdKeys
  );

  if (params._id)
    filters = {
      ...filters,
      _id: params._id,
    };
  if (params.postId)
    filters = {
      ...filters,
      postId: params.postId,
    };
  if (params.postTypeId)
    filters = {
      ...filters,
      postTypeId: params.postTypeId,
    };
  if (params.statusId)
    filters = {
      ...filters,
      statusId: params.statusId,
    };
  if (params.authorId)
    filters = {
      ...filters,
      authorId: params.authorId,
    };

  const query = postCommentModel.findOne(filters);

  query.populate(authorPopulation);

  query.sort({ _id: 'desc' });

  const doc = await query.lean<IPostCommentGetDetailedResultService>().exec();

  if (doc) {
    doc.likeNumber = doc.likes?.length ?? 0;

    if (params.authorIdDidLike) {
      doc.didLike = doc.likes?.some(
        (likedAuthorId) => likedAuthorId == params.authorIdDidLike
      );
    }

    delete doc.likes;
  }

  return doc;
};

const getManyDetailed = async (
  params: IPostCommentGetDetailedManyParamService
) => {
  let filters: mongoose.FilterQuery<IPostCommentModel> = {};
  params = MongoDBHelpers.convertToObjectIdData(
    params,
    postCommentObjectIdKeys
  );

  if (params._id)
    filters = {
      ...filters,
      _id: { $in: params._id },
    };
  if (params.postId)
    filters = {
      ...filters,
      postId: params.postId,
    };
  if (params.postTypeId)
    filters = {
      ...filters,
      postTypeId: params.postTypeId,
    };
  if (params.statusId)
    filters = {
      ...filters,
      statusId: params.statusId,
    };
  if (params.authorId)
    filters = {
      ...filters,
      authorId: params.authorId,
    };

  const query = postCommentModel.find(filters);

  query.populate(authorPopulation);

  query.sort({ _id: 'desc' });

  const docs = await query
    .lean<IPostCommentGetDetailedResultService[]>()
    .exec();

  return docs.map((doc) => {
    doc.likeNumber = doc.likes?.length ?? 0;

    if (params.authorIdDidLike) {
      doc.didLike = doc.likes?.some(
        (likedAuthorId) => likedAuthorId == params.authorIdDidLike
      );
    }

    delete doc.likes;

    return doc;
  });
};

const add = async (params: IPostCommentAddParamService) => {
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(
    params,
    postCommentObjectIdKeys
  );

  return (await postCommentModel.create(params)).toObject();
};

const update = async (params: IPostCommentUpdateParamService) => {
  let filters: mongoose.FilterQuery<IPostCommentModel> = {};
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(
    params,
    postCommentObjectIdKeys
  );

  if (params._id) {
    filters = {
      _id: params._id,
    };
  }
  if (params.postTypeId) {
    filters = {
      postTypeId: params.postTypeId,
    };
  }
  if (params.postId) {
    filters = {
      postId: params.postId,
    };
  }

  let doc = await postCommentModel.findOne(filters).exec();

  if (doc) {
    doc = Object.assign(doc, params);

    await doc.save();
  }

  return params;
};

const updateLike = async (params: IPostCommentUpdateLikeParamService) => {
  let filters: mongoose.FilterQuery<IPostCommentModel> = {};
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(
    params,
    postCommentObjectIdKeys
  );

  if (params._id) {
    filters = {
      ...filters,
      _id: params._id,
    };
  }
  if (params.postTypeId) {
    filters = {
      ...filters,
      postTypeId: params.postTypeId,
    };
  }
  if (params.postId) {
    filters = {
      ...filters,
      postId: params.postId,
    };
  }

  const doc = await postCommentModel.findOne(filters).exec();

 

  let likeNumber = 0;

  if (doc) {
    likeNumber = doc.likeCount ?? 0;

    const foundIndex = doc.likes.indexOfKey('', params.authorId);

    if (foundIndex > -1) {
      doc.likes.remove(foundIndex);
    } else {
      doc.likes.push(params.authorId as any);
    }
    
    likeNumber = doc.likes.length;

    doc.likeCount = likeNumber;

    await doc.save();
  }

  return likeNumber;
};

const updateStatusMany = async (
  params: IPostCommentUpdateStatusManyParamService
) => {
  let filters: mongoose.FilterQuery<IPostCommentModel> = {};
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(
    params,
    postCommentObjectIdKeys
  );

  if (params._id) {
    filters = {
      ...filters,
      _id: { $in: params._id },
    };
  }
  if (params.postTypeId) {
    filters = {
      ...filters,
      postTypeId: params.postTypeId,
    };
  }
  if (params.postId) {
    filters = {
      ...filters,
      postId: params.postId,
    };
  }

  const docs = await postCommentModel.find(filters).exec();

  return Promise.all(
    docs.map(async (doc) => {
      doc.statusId = params.statusId;
      doc.lastAuthorId = params.lastAuthorId;

      await doc.save();

      return {
        _id: doc._id,
        statusId: doc.statusId,
        lastAuthorId: doc.lastAuthorId,
      };
    })
  );
};

const deleteMany = async (params: IPostCommentDeleteManyParamService) => {
  let filters: mongoose.FilterQuery<IPostCommentModel> = {};
  params = MongoDBHelpers.convertToObjectIdData(
    params,
    postCommentObjectIdKeys
  );

  if (params._id) {
    filters = {
      ...filters,
      _id: { $in: params._id },
    };
  }
  if (params.postTypeId) {
    filters = {
      ...filters,
      postTypeId: params.postTypeId,
    };
  }
  if (params.postId) {
    filters = {
      ...filters,
      postId: params.postId,
    };
  }

  return (await postCommentModel.deleteMany(filters).exec()).deletedCount;
};

export const PostCommentService = {
  get: get,
  getMany: getMany,
  getDetailed: getDetailed,
  getManyDetailed: getManyDetailed,
  add: add,
  update: update,
  updateLike: updateLike,
  updateStatusMany: updateStatusMany,
  deleteMany: deleteMany,
};
