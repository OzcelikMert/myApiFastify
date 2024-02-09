import * as mongoose from "mongoose";
import MongoDBHelpers from "../library/mongodb/helpers";
import Variable from "../library/variable";
import {
    SubscriberDeleteManyParamDocument,
    SubscriberAddDocument,
    SubscriberGetManyParamDocument,
    SubscriberGetResultDocument,
    SubscriberGetOneParamDocument,
    SubscriberDeleteOneParamDocument
} from "../types/services/subscriber.service";
import subscriberModel from "../models/subscriber.model";
import {SubscriberDocument} from "../types/models/subscriber.model";
import {SubscriberObjectIdKeys} from "../constants/objectIdKeys/subscriber.objectIdKeys";

const getOne = async (params: SubscriberGetOneParamDocument) => {
    let filters: mongoose.FilterQuery<SubscriberDocument> = {}
    params = MongoDBHelpers.convertObjectIdInData(params, SubscriberObjectIdKeys);

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

    return (await query.lean<SubscriberGetResultDocument>().exec());
}

const getMany = async (params: SubscriberGetManyParamDocument) => {
    let filters: mongoose.FilterQuery<SubscriberDocument> = {}
    params = MongoDBHelpers.convertObjectIdInData(params, SubscriberObjectIdKeys);

    if (params._id) {
        filters = {
            ...filters,
            _id: {$in: params._id}
        }
    }
    if (params.email) {
        filters = {
            ...filters,
            email: {$regex: new RegExp(params.email, "i")}
        }
    }

    let query = subscriberModel.find(filters, {});

    query.sort({createdAt: -1});

    return (await query.lean<SubscriberGetResultDocument[]>().exec());
}

const add = async (params: SubscriberAddDocument) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertObjectIdInData(params, SubscriberObjectIdKeys);

    return await subscriberModel.create(params)
}

const deleteOne = async (params: SubscriberDeleteOneParamDocument) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertObjectIdInData(params, SubscriberObjectIdKeys);

    let filters: mongoose.FilterQuery<SubscriberDocument> = {}

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

const deleteMany = async (params: SubscriberDeleteManyParamDocument) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertObjectIdInData(params, SubscriberObjectIdKeys);

    let filters: mongoose.FilterQuery<SubscriberDocument> = {}

    if(params._id){
        filters = {
            ...filters,
            _id: {$in: params._id}
        }
    }

    return (await subscriberModel.deleteMany(filters).exec()).deletedCount;
}

export default {
    getOne: getOne,
    getMany: getMany,
    add: add,
    deleteOne: deleteOne,
    deleteMany: deleteMany
};