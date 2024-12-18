import * as mongoose from 'mongoose';
import { MongoDBHelpers } from '@library/mongodb/helpers';
import { VariableLibrary } from '@library/variable';
import {
  ISubscriberDeleteManyParamService,
  ISubscriberAddParamService,
  ISubscriberGetManyParamService,
  ISubscriberGetParamService,
  ISubscriberDeleteParamService,
} from 'types/services/subscriber.service';
import { subscriberModel } from '@models/subscriber.model';
import { ISubscriberModel } from 'types/models/subscriber.model';
import { subscriberObjectIdKeys } from '@constants/objectIdKeys/subscriber.objectIdKeys';

const get = async (params: ISubscriberGetParamService) => {
  let filters: mongoose.FilterQuery<ISubscriberModel> = {};
  params = MongoDBHelpers.convertToObjectIdData(params, subscriberObjectIdKeys);

  if (params._id) {
    filters = {
      ...filters,
      _id: params._id,
    };
  }
  if (params.email) {
    filters = {
      ...filters,
      email: params.email,
    };
  }

  const query = subscriberModel.findOne(filters, {});

  query.sort({ _id: 'desc' });

  return await query.lean<ISubscriberModel>().exec();
};

const getMany = async (params: ISubscriberGetManyParamService) => {
  let filters: mongoose.FilterQuery<ISubscriberModel> = {};
  params = MongoDBHelpers.convertToObjectIdData(params, subscriberObjectIdKeys);

  if (params._id) {
    filters = {
      ...filters,
      _id: { $in: params._id },
    };
  }
  if (params.email) {
    filters = {
      ...filters,
      email: { $in: params.email },
    };
  }

  const query = subscriberModel.find(filters, {});

  query.sort({ _id: 'desc' });

  const docs = await query.lean<ISubscriberModel[]>().exec();

  return docs;
};

const add = async (params: ISubscriberAddParamService) => {
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(params, subscriberObjectIdKeys);

  return (await subscriberModel.create(params)).toObject();
};

const delete_ = async (params: ISubscriberDeleteParamService) => {
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(params, subscriberObjectIdKeys);

  let filters: mongoose.FilterQuery<ISubscriberModel> = {};

  if (params._id) {
    filters = {
      ...filters,
      _id: params._id,
    };
  }
  if (params.email) {
    filters = {
      ...filters,
      email: params.email,
    };
  }

  return (await subscriberModel.deleteOne(filters).exec()).deletedCount;
};

const deleteMany = async (params: ISubscriberDeleteManyParamService) => {
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(params, subscriberObjectIdKeys);

  let filters: mongoose.FilterQuery<ISubscriberModel> = {};

  if (params._id) {
    filters = {
      ...filters,
      _id: { $in: params._id },
    };
  }

  return (await subscriberModel.deleteMany(filters).exec()).deletedCount;
};

export const SubscriberService = {
  get: get,
  getMany: getMany,
  add: add,
  delete: delete_,
  deleteMany: deleteMany,
};
