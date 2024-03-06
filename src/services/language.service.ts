import * as mongoose from "mongoose";
import {languageModel} from "../models/language.model";
import {
    ILanguageGetResultService,
    ILanguageGetManyParamService,
    ILanguageAddParamService,
    ILanguageGetOneParamService,
    ILanguageUpdateOneParamService,
    ILanguageUpdateOneRankParamService,
    ILanguageUpdateIsDefaultManyParamService
} from "../types/services/language.service";
import MongoDBHelpers from "../library/mongodb/helpers";
import Variable from "../library/variable";
import {languageObjectIdKeys} from "../constants/objectIdKeys/language.objectIdKeys";
import { ILanguageModel } from "../types/models/language.model";

const getOne = async (params: ILanguageGetOneParamService) => {
    let filters: mongoose.FilterQuery<ILanguageModel> = {}
    params = MongoDBHelpers.convertObjectIdInData(params, languageObjectIdKeys);

    if (params._id) {
        filters = {
            ...filters,
            _id: params._id
        }
    }
    if (params.shortKey) {
        filters = {
            ...filters,
            shortKey: params.shortKey
        }
    }
    if (params.locale) {
        filters = {
            ...filters,
            locale: params.locale
        }
    }
    if (params.isDefault) {
        filters = {
            ...filters,
            isDefault: params.isDefault
        }
    }

    let query = languageModel.findOne(filters, {});

    query.sort({ rank: 1, createdAt: -1 });

    return (await query.lean<ILanguageGetResultService>().exec());
}

const getMany = async (params: ILanguageGetManyParamService) => {
    let filters: mongoose.FilterQuery<ILanguageModel> = {}
    params = MongoDBHelpers.convertObjectIdInData(params, languageObjectIdKeys);

    if (params._id) {
        filters = {
            ...filters,
            _id: { $in: params._id }
        }
    }

    if (params.statusId) {
        filters = {
            ...filters,
            statusId: params.statusId
        }
    }

    let query = languageModel.find(filters, {});

    query.sort({ rank: 1, createdAt: -1 });

    return (await query.lean<ILanguageGetResultService[]>().exec());
}

const add = async (params: ILanguageAddParamService) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertObjectIdInData(params, languageObjectIdKeys);

    return (await languageModel.create(params)).toObject()
}

const updateOne = async (params: ILanguageUpdateOneParamService) => {
    let filters: mongoose.FilterQuery<ILanguageModel> = {}
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertObjectIdInData(params, languageObjectIdKeys);

    if (params._id) {
        filters = {
            _id: params._id
        };
    }

    let doc = (await languageModel.findOne(filters).exec());

    if (doc) {
        doc = Object.assign(doc, params);

        await doc.save();
    }

    return {
        ...params,
        _id: doc?._id,
    };
}

const updateOneRank = async (params: ILanguageUpdateOneRankParamService) => {
    let filters: mongoose.FilterQuery<ILanguageModel> = {}
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertObjectIdInData(params, languageObjectIdKeys);

    if (params._id) {
        filters = {
            ...filters,
            _id: params._id
        }
    }

    let doc = (await languageModel.findOne(filters).exec());

    if (doc) {
        doc.rank = params.rank;

        await doc.save();
    }

    return {
        _id: doc?._id,
        rank: doc?.rank
    };
}

const updateIsDefaultMany = async (params: ILanguageUpdateIsDefaultManyParamService) => {
    let filters: mongoose.FilterQuery<ILanguageModel> = {}
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertObjectIdInData(params, languageObjectIdKeys);

    if (params._id) {
        filters = {
            _id: params._id
        };
    }

    let docs = (await languageModel.find(filters).exec());

    if (docs) {
       for (const doc of docs) {
           doc.isDefault = params.isDefault;
           await doc.save();
       }
       return true;
    }

    return false;
}

export const LanguageService = {
    getOne: getOne,
    getMany: getMany,
    add: add,
    updateOne: updateOne,
    updateOneRank: updateOneRank,
    updateIsDefaultMany: updateIsDefaultMany
};