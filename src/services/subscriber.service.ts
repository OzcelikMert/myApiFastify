import * as mongoose from "mongoose";
import MongoDBHelpers from "../library/mongodb/helpers";
import Variable from "../library/variable";
import {
    ISubscriberDeleteManyParamService,
    ISubscriberAddParamService,
    ISubscriberGetManyParamService,
    ISubscriberGetResultService,
    ISubscriberGetParamService,
    ISubscriberDeleteParamService
} from "../types/services/subscriber.service";
import {subscriberModel} from "../models/subscriber.model";
import {ISubscriberModel} from "../types/models/subscriber.model";
import {subscriberObjectIdKeys} from "../constants/objectIdKeys/subscriber.objectIdKeys";

const get = async (params: ISubscriberGetParamService) => {
    let filters: mongoose.FilterQuery<ISubscriberModel> = {}
    params = MongoDBHelpers.convertToObjectIdData(params, subscriberObjectIdKeys);

    if (params._id) {
        filters = {
            ...filters,
            _id: params._id
        }
    }
    if (params.email) {
        filters = {
            ...filters,
            email: params.email
        }
    }

    let query = subscriberModel.findOne(filters, {});

    query.sort({createdAt: -1});

    return (await query.lean<ISubscriberGetResultService>().exec());
}

const getMany = async (params: ISubscriberGetManyParamService) => {
    let filters: mongoose.FilterQuery<ISubscriberModel> = {}
    params = MongoDBHelpers.convertToObjectIdData(params, subscriberObjectIdKeys);

    if (params._id) {
        filters = {
            ...filters,
            _id: {$in: params._id}
        }
    }
    if (params.email) {
        filters = {
            ...filters,
            email: {$in: params.email}
        }
    }

    let query = subscriberModel.find(filters, {});

    query.sort({createdAt: -1});

    return (await query.lean<ISubscriberGetResultService[]>().exec());
}

const add = async (params: ISubscriberAddParamService) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertToObjectIdData(params, subscriberObjectIdKeys);

    return (await subscriberModel.create(params)).toObject()
}

const delete_ = async (params: ISubscriberDeleteParamService) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertToObjectIdData(params, subscriberObjectIdKeys);

    let filters: mongoose.FilterQuery<ISubscriberModel> = {}

    if (params._id) {
        filters = {
            ...filters,
            _id: params._id
        }
    }
    if (params.email) {
        filters = {
            ...filters,
            email: params.email
        }
    }

    return (await subscriberModel.deleteOne(filters).exec()).deletedCount;
}

const deleteMany = async (params: ISubscriberDeleteManyParamService) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertToObjectIdData(params, subscriberObjectIdKeys);

    let filters: mongoose.FilterQuery<ISubscriberModel> = {}

    if(params._id){
        filters = {
            ...filters,
            _id: {$in: params._id}
        }
    }

    return (await subscriberModel.deleteMany(filters).exec()).deletedCount;
}

export const SubscriberService = {
    get: get,
    getMany: getMany,
    add: add,
    delete: delete_,
    deleteMany: deleteMany
};