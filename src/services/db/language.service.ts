import * as mongoose from 'mongoose';
import { languageModel } from '@models/language.model';
import {
  ILanguageGetManyParamService,
  ILanguageAddParamService,
  ILanguageGetParamService,
  ILanguageUpdateParamService,
  ILanguageUpdateRankParamService,
  ILanguageUpdateIsDefaultManyParamService,
} from 'types/services/db/language.service';
import { MongoDBHelpers } from '@library/mongodb/helpers';
import { VariableLibrary } from '@library/variable';
import { languageObjectIdKeys } from '@constants/objectIdKeys/language.objectIdKeys';
import { ILanguageModel } from 'types/models/language.model';
import { PopulationSelects } from '@constants/populationSelects';

const authorPopulation = {
  path: ['author', 'lastAuthor'].join(' '),
  select: PopulationSelects.author,
  options: { omitUndefined: true },
};

const get = async (params: ILanguageGetParamService) => {
  let filters: mongoose.FilterQuery<ILanguageModel> = {};
  params = MongoDBHelpers.convertToObjectIdData(params, languageObjectIdKeys);

  if (params._id) {
    filters = {
      ...filters,
      _id: params._id,
    };
  }
  if (params.isDefault) {
    filters = {
      ...filters,
      isDefault: params.isDefault,
    };
  }

  const query = languageModel.findOne(filters, {});

  query.populate(authorPopulation);

  query.sort({ rank: 'asc', _id: 'desc' });

  return await query.lean<ILanguageModel>().exec();
};

const getMany = async (params: ILanguageGetManyParamService) => {
  let filters: mongoose.FilterQuery<ILanguageModel> = {};
  params = MongoDBHelpers.convertToObjectIdData(params, languageObjectIdKeys);

  if (params._id) {
    filters = {
      ...filters,
      _id: { $in: params._id },
    };
  }
  if (params.statusId) {
    filters = {
      ...filters,
      statusId: params.statusId,
    };
  }
  if (params.shortKey) {
    filters = {
      ...filters,
      shortKey: params.shortKey,
    };
  }
  if (params.locale) {
    filters = {
      ...filters,
      locale: params.locale,
    };
  }

  const query = languageModel.find(filters, {});

  query.populate(authorPopulation);

  query.sort({ rank: 'asc', _id: 'desc' });

  const docs = await query.lean<ILanguageModel[]>().exec();

  return docs;
};

const add = async (params: ILanguageAddParamService) => {
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(params, languageObjectIdKeys);

  if (params.locale) {
    params.locale = params.locale.toLowerCase();
  }

  if (params.shortKey) {
    params.shortKey = params.shortKey.toLowerCase();
  }

  return (await languageModel.create(params)).toObject();
};

const update = async (params: ILanguageUpdateParamService) => {
  let filters: mongoose.FilterQuery<ILanguageModel> = {};
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(params, languageObjectIdKeys);

  if (params._id) {
    filters = {
      _id: params._id,
    };
  }

  let doc = await languageModel.findOne(filters).exec();

  if (doc) {
    if (params.locale) {
      params.locale = params.locale.toLowerCase();
    }

    if (params.shortKey) {
      params.shortKey = params.shortKey.toLowerCase();
    }

    doc = Object.assign(doc, params);

    await doc.save();
  }

  return {
    ...params,
    _id: doc?._id,
  };
};

const updateRank = async (params: ILanguageUpdateRankParamService) => {
  let filters: mongoose.FilterQuery<ILanguageModel> = {};
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(params, languageObjectIdKeys);

  if (params._id) {
    filters = {
      ...filters,
      _id: params._id,
    };
  }

  const doc = await languageModel.findOne(filters).exec();

  if (doc) {
    doc.rank = params.rank;

    await doc.save();
  }

  return {
    _id: doc?._id,
    rank: doc?.rank,
  };
};

const updateIsDefaultMany = async (
  params: ILanguageUpdateIsDefaultManyParamService
) => {
  let filters: mongoose.FilterQuery<ILanguageModel> = {};
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(params, languageObjectIdKeys);

  if (params._id) {
    filters = {
      _id: params._id,
    };
  }

  const docs = await languageModel.find(filters).exec();

  if (docs) {
    for (const doc of docs) {
      doc.isDefault = params.isDefault;
      await doc.save();
    }
    return true;
  }

  return false;
};

export const LanguageService = {
  get: get,
  getMany: getMany,
  add: add,
  update: update,
  updateRank: updateRank,
  updateIsDefaultMany: updateIsDefaultMany,
};
