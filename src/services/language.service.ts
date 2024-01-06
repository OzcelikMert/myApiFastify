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

export default {
    async getOne(params: LanguageGetOneParamDocument) {
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

        return (await query.lean().exec()) as LanguageGetResultDocument | null;
    },
    async getMany(params: LanguageGetManyParamDocument) {
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

        return (await query.lean().exec()) as LanguageGetResultDocument[];
    },
    async add(params: LanguageAddParamDocument) {
        params = Variable.clearAllScriptTags(params);
        params = MongoDBHelpers.convertObjectIdInData(params, languageObjectIdKeys);

        return await languageModel.create(params)
    },
    async updateOne(params: LanguageUpdateOneParamDocument) {
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
    },
    async updateOneRank(params: LanguageUpdateOneRankParamDocument) {
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
};