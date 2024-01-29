import * as mongoose from "mongoose";
import languageModel from "../models/language.model";
import {
    LanguageGetResultDocument,
    LanguageGetManyParamDocument,
    LanguageAddParamDocument,
    LanguageGetOneParamDocument, LanguageUpdateOneParamDocument, LanguageUpdateOneRankParamDocument
} from "../types/services/language.service";
import MongoDBHelpers from "../library/mongodb/helpers";
import Variable from "../library/variable";
import languageObjectIdKeys from "../constants/objectIdKeys/language.objectIdKeys";
import { LanguageDocument } from "../types/models/language.model";

const getOne = async (params: LanguageGetOneParamDocument) => {
    let filters: mongoose.FilterQuery<LanguageDocument> = {}
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

    let query = languageModel.findOne(filters, {});

    query.sort({ rank: 1, createdAt: -1 });

    return (await query.lean<LanguageGetResultDocument>().exec());
}

const getMany = async (params: LanguageGetManyParamDocument) => {
    let filters: mongoose.FilterQuery<LanguageDocument> = {}
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

    return (await query.lean<LanguageGetResultDocument[]>().exec());
}

const add = async (params: LanguageAddParamDocument) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertObjectIdInData(params, languageObjectIdKeys);

    return await languageModel.create(params)
}

const updateOne = async (params: LanguageUpdateOneParamDocument) => {
    let filters: mongoose.FilterQuery<LanguageDocument> = {}
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

const updateOneRank = async (params: LanguageUpdateOneRankParamDocument) => {
    let filters: mongoose.FilterQuery<LanguageDocument> = {}
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

export default {
    getOne: getOne,
    getMany: getMany,
    add: add,
    updateOne: updateOne,
    updateOneRank: updateOneRank
};