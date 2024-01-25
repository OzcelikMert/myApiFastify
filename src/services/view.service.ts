import * as mongoose from "mongoose";
import viewModel from "../models/view.model";
import {
    ViewDeleteManyParamDocument,
    ViewAddParamDocument,
    ViewGetParamDocument, ViewGetTotalResultDocument, ViewGetResultDocument
} from "../types/services/view.service";
import MongoDBHelpers from "../library/mongodb/helpers";
import Variable from "../library/variable";
import viewObjectIdKeys from "../constants/objectIdKeys/view.objectIdKeys";
import {ViewDocument} from "../types/models/view.model";

export default {
    async getOne(params: ViewGetParamDocument) {
        let filters: mongoose.FilterQuery<ViewDocument> = {}
        params = MongoDBHelpers.convertObjectIdInData(params, viewObjectIdKeys);

        if (params.ip) filters = {
            ...filters,
            ip: params.ip
        }
        if (params.url) filters = {
            ...filters,
            url: params.url
        }
        if (params.langId) filters = {
            ...filters,
            langId: params.langId
        }
        if (params.city) filters = {
            ...filters,
            city: params.city
        }
        if (params.country) filters = {
            ...filters,
            country: params.country
        }
        if (params.region) filters = {
            ...filters,
            region: params.region
        }
        if (params.dateStart) {
            filters = {
                ...filters,
                createdAt: {
                    $gt: params.dateStart,
                    ...((params.dateEnd) ? {$lt: params.dateEnd} : {})
                }
            }
        }

        return await viewModel.findOne(filters).lean<ViewGetResultDocument>().exec();
    },
    async getTotalWithDate(params: ViewGetParamDocument) {
        let filters: mongoose.FilterQuery<ViewDocument> = {}
        params = MongoDBHelpers.convertObjectIdInData(params, viewObjectIdKeys);

        if (params.dateStart) {
            filters = {
                ...filters,
                createdAt: {
                    $gt: params.dateStart,
                    ...((params.dateEnd) ? {$lt: params.dateEnd} : {})
                }
            }
        }

        return (await viewModel.aggregate([
            {
              $match: filters
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    ipList: { $addToSet: "$ip" }
                }
            },
            {
                $unwind: "$ipList"
            },
            {
                $group: {
                    _id: "$_id",
                    total: { $sum: 1 }
                },
            }
        ]).sort({_id: 1}).exec()) as ViewGetTotalResultDocument[];
    },
    async getTotalWithCountry(params: ViewGetParamDocument) {
        let filters: mongoose.FilterQuery<ViewDocument> = {}
        params = MongoDBHelpers.convertObjectIdInData(params, viewObjectIdKeys);

        if (params.dateStart) {
            filters = {
                ...filters,
                createdAt: {
                    $gt: params.dateStart,
                    ...((params.dateEnd) ? {$lt: params.dateEnd} : {})
                }
            }
        }

        return (await viewModel.aggregate([
            {
                $match: filters
            },
            {
                $group: {
                    _id: "$country",
                    ipList: { $addToSet: "$ip" }
                },
            },
            {
                $unwind: "$ipList"
            },
            {
                $group: {
                    _id: "$_id",
                    total: { $sum: 1 }
                },
            }
        ]).sort({_id: 1}).exec()) as ViewGetTotalResultDocument[];
    },
    async add(params: ViewAddParamDocument) {
        params = Variable.clearAllScriptTags(params);
        params = MongoDBHelpers.convertObjectIdInData(params, viewObjectIdKeys);

        return await viewModel.create(params)
    },
    async deleteMany(params: ViewDeleteManyParamDocument) {
        let filters: mongoose.FilterQuery<ViewDocument> = {};
        params = MongoDBHelpers.convertObjectIdInData(params, viewObjectIdKeys);

        if(params.dateEnd){
            filters = {
                ...filters,
                createdAt: {
                    $lt: params.dateEnd
                }
            }
        }

        return (await viewModel.deleteMany(filters).exec()).deletedCount;
    }
};