import * as mongoose from 'mongoose';
import { MongoDBHelpers } from '@library/mongodb/helpers';
import { VariableLibrary } from '@library/variable';
import { galleryObjectIdKeys } from '@constants/objectIdKeys/gallery.objectIdKeys';
import { IGalleryModel } from 'types/models/gallery.model';
import {
  IGalleryAddParamService,
  IGalleryDeleteManyParamService,
  IGalleryGetDetailedParamService,
  IGalleryGetManyDetailedParamService,
  IGalleryGetManyParamService,
  IGalleryGetParamService,
  IGalleryGetDetailedResultService,
} from 'types/services/gallery.service';
import { galleryModel } from '@models/gallery.model';
import { PopulationSelects } from '@constants/populationSelects';

const authorPopulation = {
  path: ['author'].join(' '),
  select: PopulationSelects.author,
  options: { omitUndefined: true },
};

const get = async (params: IGalleryGetParamService) => {
  let filters: mongoose.FilterQuery<IGalleryModel> = {};
  params = MongoDBHelpers.convertToObjectIdData(params, galleryObjectIdKeys);

  if (params._id)
    filters = {
      ...filters,
      _id: params._id,
    };
  if (params.name)
    filters = {
      ...filters,
      name: params.name,
    };
  if (params.authorId)
    filters = {
      ...filters,
      authorId: params.authorId,
    };

  const query = galleryModel.findOne(filters);

  query.sort({ _id: 'desc' });

  return await query.lean<IGalleryModel>().exec();
};

const getMany = async (params: IGalleryGetManyParamService) => {
  let filters: mongoose.FilterQuery<IGalleryModel> = {};
  params = MongoDBHelpers.convertToObjectIdData(params, galleryObjectIdKeys);

  if (params._id)
    filters = {
      ...filters,
      _id: { $in: params._id },
    };
  if (params.name)
    filters = {
      ...filters,
      name: { $in: params.name },
    };
  if (params.authorId)
    filters = {
      ...filters,
      authorId: params.authorId,
    };
  if (params.typeId)
    filters = {
      ...filters,
      typeId: params.typeId,
    };

  const query = galleryModel.find(filters);

  query.sort({ _id: 'desc' });

  const docs = await query.lean<IGalleryModel[]>().exec();

  return docs;
};

const getDetailed = async (params: IGalleryGetDetailedParamService) => {
  let filters: mongoose.FilterQuery<IGalleryModel> = {};
  params = MongoDBHelpers.convertToObjectIdData(params, galleryObjectIdKeys);

  if (params._id)
    filters = {
      ...filters,
      _id: params._id,
    };
  if (params.name)
    filters = {
      ...filters,
      name: params.name,
    };
  if (params.authorId)
    filters = {
      ...filters,
      authorId: params.authorId,
    };

  const query = galleryModel.findOne(filters);

  query.populate(authorPopulation);

  query.sort({ _id: 'desc' });

  return await query.lean<IGalleryGetDetailedResultService>().exec();
};

const getManyDetailed = async (params: IGalleryGetManyDetailedParamService) => {
  let filters: mongoose.FilterQuery<IGalleryModel> = {};
  params = MongoDBHelpers.convertToObjectIdData(params, galleryObjectIdKeys);

  if (params._id)
    filters = {
      ...filters,
      _id: { $in: params._id },
    };
  if (params.name)
    filters = {
      ...filters,
      name: { $in: params.name },
    };
  if (params.authorId)
    filters = {
      ...filters,
      authorId: params.authorId,
    };
  if (params.typeId)
    filters = {
      ...filters,
      typeId: params.typeId,
    };

  const query = galleryModel.find(filters);

  query.populate(authorPopulation);

  query.sort({ _id: 'desc' });

  const docs = await query.lean<IGalleryGetDetailedResultService[]>().exec();

  return docs;
};

const add = async (params: IGalleryAddParamService) => {
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(params, galleryObjectIdKeys);

  return (await galleryModel.create(params)).toObject();
};

const deleteMany = async (params: IGalleryDeleteManyParamService) => {
  let filters: mongoose.FilterQuery<IGalleryModel> = {};
  params = MongoDBHelpers.convertToObjectIdData(params, galleryObjectIdKeys);

  if (params._id)
    filters = {
      ...filters,
      _id: { $in: params._id },
    };
  if (params.authorId)
    filters = {
      ...filters,
      authorId: params.authorId,
    };

  return (await galleryModel.deleteMany(filters).exec()).deletedCount;
};

export const GalleryService = {
  get: get,
  getMany: getMany,
  getDetailed: getDetailed,
  getManyDetailed: getManyDetailed,
  add: add,
  deleteMany: deleteMany,
};
