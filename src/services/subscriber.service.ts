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
import postObjectIdKeys from "../constants/objectIdKeys/post.objectIdKeys";
import {SubscriberDocument} from "../types/models/subscriber.model";

export default {
    async getOne(params: SubscriberGetOneParamDocument) {
        let filters: mongoose.FilterQuery<SubscriberDocument> = {}
        params = MongoDBHelpers.convertObjectIdInData(params, postObjectIdKeys);

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
    },
    async getMany(params: SubscriberGetManyParamDocument) {
        let filters: mongoose.FilterQuery<SubscriberDocument> = {}
        params = MongoDBHelpers.convertObjectIdInData(params, postObjectIdKeys);

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
    },
    async add(params: SubscriberAddDocument) {
        params = Variable.clearAllScriptTags(params);
        params = MongoDBHelpers.convertObjectIdInData(params, postObjectIdKeys);

        return await subscriberModel.create(params)
    },
    async deleteOne(params: SubscriberDeleteOneParamDocument) {
        params = Variable.clearAllScriptTags(params);
        params = MongoDBHelpers.convertObjectIdInData(params, postObjectIdKeys);

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
    },
    async deleteMany(params: SubscriberDeleteManyParamDocument) {
        params = Variable.clearAllScriptTags(params);
        params = MongoDBHelpers.convertObjectIdInData(params, postObjectIdKeys);

        let filters: mongoose.FilterQuery<SubscriberDocument> = {}

        if(params._id){
            filters = {
                ...filters,
                _id: {$in: params._id}
            }
        }

        return (await subscriberModel.deleteMany(filters).exec()).deletedCount;
    },
};