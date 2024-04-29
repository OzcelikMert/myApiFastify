import * as mongoose from "mongoose";
import {viewModel} from "@models/view.model";
import {
    IViewDeleteManyParamService,
    IViewAddParamService,
    IViewGetParamService, IViewGetTotalResultService
} from "types/services/view.service";
import {MongoDBHelpers} from "@library/mongodb/helpers";
import {VariableLibrary} from "@library/variable";
import {viewObjectIdKeys} from "@constants/objectIdKeys/view.objectIdKeys";
import {IViewModel} from "types/models/view.model";
import {Config} from "@configs/index";

const get = async (params: IViewGetParamService) => {
    let filters: mongoose.FilterQuery<IViewModel> = {}
    params = MongoDBHelpers.convertToObjectIdData(params, viewObjectIdKeys);

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

    return await viewModel.findOne(filters).lean<IViewModel>().exec();
}

const getTotalWithDate = async (params: IViewGetParamService) => {
    let filters: mongoose.FilterQuery<IViewModel> = {}
    params = MongoDBHelpers.convertToObjectIdData(params, viewObjectIdKeys);

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
    ]).sort({_id: 1}).exec()) as IViewGetTotalResultService[];
}

const getTotalWithCountry = async (params: IViewGetParamService) => {
    let filters: mongoose.FilterQuery<IViewModel> = {}
    params = MongoDBHelpers.convertToObjectIdData(params, viewObjectIdKeys);

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
    ]).sort({_id: 1}).exec()) as IViewGetTotalResultService[];
}

const add = async (params: IViewAddParamService) => {
    params = VariableLibrary.clearAllScriptTags(params);
    params = MongoDBHelpers.convertToObjectIdData(params, viewObjectIdKeys);

    params.langId = params.langId || Config.defaultLangId;

    return (await viewModel.create(params)).toObject()
}

const deleteMany = async (params: IViewDeleteManyParamService) => {
    let filters: mongoose.FilterQuery<IViewModel> = {};
    params = MongoDBHelpers.convertToObjectIdData(params, viewObjectIdKeys);

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

export const ViewService = {
    get: get,
    getTotalWithDate: getTotalWithDate,
    getTotalWithCountry: getTotalWithCountry,
    add: add,
    deleteMany: deleteMany
};