import * as mongoose from "mongoose";
import {languageModel} from "../models/language.model";
import {
    ILanguageGetResultService,
    ILanguageGetManyParamService,
    ILanguageAddParamService,
    ILanguageGetParamService,
    ILanguageUpdateParamService,
    ILanguageUpdateRankParamService,
    ILanguageUpdateIsDefaultManyParamService
} from "../types/services/language.service";
import MongoDBHelpers from "../library/mongodb/helpers";
import Variable from "../library/variable";
import {languageObjectIdKeys} from "../constants/objectIdKeys/language.objectIdKeys";
import { ILanguageModel } from "../types/models/language.model";

const get = async (params: ILanguageGetParamService) => {
    let filters: mongoose.FilterQuery<ILanguageModel> = {}
    params = MongoDBHelpers.convertObjectIdInData(params, languageObjectIdKeys);

    if (params._id) {
        filters = {
            ...filters,
            _id: params._id
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

    let query = languageModel.find(filters, {});

    query.sort({ rank: 1, createdAt: -1 });

    return (await query.lean<ILanguageGetResultService[]>().exec());
}

const add = async (params: ILanguageAddParamService) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertObjectIdInData(params, languageObjectIdKeys);

    if(params.locale){
        params.locale = params.locale.toLowerCase();
    }

    if(params.shortKey){
        params.shortKey = params.shortKey.toLowerCase();
    }

    return (await languageModel.create(params)).toObject()
}

const update = async (params: ILanguageUpdateParamService) => {
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
        if(params.locale){
            params.locale = params.locale.toLowerCase();
        }

        if(params.shortKey){
            params.shortKey = params.shortKey.toLowerCase();
        }

        doc = Object.assign(doc, params);

        await doc.save();
    }

    return {
        ...params,
        _id: doc?._id,
    };
}

const updateRank = async (params: ILanguageUpdateRankParamService) => {
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
    get: get,
    getMany: getMany,
    add: add,
    update: update,
    updateRank: updateRank,
    updateIsDefaultMany: updateIsDefaultMany
};