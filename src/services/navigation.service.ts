import * as mongoose from "mongoose";
import MongoDBHelpers from "../library/mongodb/helpers";
import Variable from "../library/variable";
import { Config } from "../config";
import navigationObjectIdKeys from "../constants/objectIdKeys/navigation.objectIdKeys";
import {
    NavigationDeleteManyParamDocument,
    NavigationAddParamDocument,
    NavigationGetOneParamDocument,
    NavigationGetResultDocument,
    NavigationUpdateOneParamDocument,
    NavigationUpdateOneRankParamDocument,
    NavigationUpdateManyStatusIdParamDocument, NavigationGetManyParamDocument
} from "../types/services/navigation.service";
import navigationModel from "../models/navigation.model";
import { StatusId } from "../constants/status";
import { NavigationDocument } from "../types/models/navigation.model";

export default {
    async getOne(params: NavigationGetOneParamDocument) {
        let filters: mongoose.FilterQuery<NavigationDocument> = {}
        params = MongoDBHelpers.convertObjectIdInData(params, navigationObjectIdKeys);
        let defaultLangId = MongoDBHelpers.createObjectId(Config.defaultLangId);

        if (params._id) filters = {
            ...filters,
            _id: params._id
        }
        if (params.statusId) filters = {
            ...filters,
            statusId: params.statusId
        }

        let query = navigationModel.findOne(filters);

        query.populate({
            path: "mainId",
            select: "_id contents",
            match: { statusId: StatusId.Active},
            options: { omitUndefined: true },
            transform: (doc: NavigationGetResultDocument) => {
                if (doc) {
                    if (Array.isArray(doc.contents)) {
                        doc.contents = doc.contents.findSingle("langId", params.langId) ?? doc.contents.findSingle("langId", defaultLangId);
                    }
                    return doc;
                }
            }
        });

        query.populate({
            path: [
                "authorId",
                "lastAuthorId"
            ].join(" "),
            select: "_id name url"
        })

        query.sort({ rank: 1, createdAt: -1 });

        let doc = (await query.lean<NavigationGetResultDocument>().exec());

        if (doc) {
            if (Array.isArray(doc.contents)) {
                let docContent = doc.contents.findSingle("langId", params.langId) ?? doc.contents.findSingle("langId", defaultLangId);
                if (docContent) {
                    doc.contents = docContent;
                }
            }
        }

        return doc
    },
    async getMany(params: NavigationGetManyParamDocument) {
        let filters: mongoose.FilterQuery<NavigationDocument> = {}
        params = MongoDBHelpers.convertObjectIdInData(params, navigationObjectIdKeys);
        let defaultLangId = MongoDBHelpers.createObjectId(Config.defaultLangId);

        if (params._id) filters = {
            ...filters,
            _id: { $in: params._id }
        }
        if (params.statusId) filters = {
            ...filters,
            statusId: params.statusId
        }

        let query = navigationModel.find(filters);

        query.populate({
            path: "mainId",
            select: "_id contents.title contents.url contents.langId",
            match: { statusId: StatusId.Active },
            options: { omitUndefined: true },
            transform: (doc: NavigationGetResultDocument) => {
                if (doc) {
                    if (Array.isArray(doc.contents)) {
                        doc.contents = doc.contents.findSingle("langId", params.langId) ?? doc.contents.findSingle("langId", defaultLangId);
                    }
                    return doc;
                }
            }
        });

        query.populate({
            path: [
                "authorId",
                "lastAuthorId"
            ].join(" "),
            select: "_id name url"
        })

        query.sort({ rank: 1, createdAt: -1 });

        return (await query.lean<NavigationGetResultDocument[]>().exec()).map((doc) => {
            if (Array.isArray(doc.contents)) {
                let docContent = doc.contents.findSingle("langId", params.langId);
                if (!docContent && !params.ignoreDefaultLanguage) {
                    docContent = doc.contents.findSingle("langId", defaultLangId);
                }

                if (docContent) {
                    doc.contents = docContent;
                }
            }

            return doc;
        });
    },
    async add(params: NavigationAddParamDocument) {
        params = Variable.clearAllScriptTags(params);
        params = MongoDBHelpers.convertObjectIdInData(params, navigationObjectIdKeys);

        if (Variable.isEmpty(params.mainId)) {
            delete params.mainId;
        }

        return await navigationModel.create(params);
    },
    async updateOne(params: NavigationUpdateOneParamDocument) {
        params = Variable.clearAllScriptTags(params);
        params = MongoDBHelpers.convertObjectIdInData(params, navigationObjectIdKeys);

        let filters: mongoose.FilterQuery<NavigationDocument> = {}

        if (params._id) {
            filters = {
                _id: params._id
            };
        }

        let doc = (await navigationModel.findOne(filters).exec());

        if (doc) {
            if (params.contents) {
                let docContent = doc.contents.findSingle("langId", params.contents.langId);
                if (docContent) {
                    docContent = Object.assign(docContent, params.contents);
                } else {
                    doc.contents.push(params.contents)
                }
                delete params.contents;
            }

            doc = Object.assign(doc, params);

            if (Variable.isEmpty(params.mainId)) {
                doc.mainId = undefined;
            }

            if (params.mainId) {
                doc.mainId = params.mainId;
            }

            await doc.save();
        }

        return {
            _id: doc?._id,
            lastAuthorId: doc?.lastAuthorId
        }
    },
    async updateOneRank(params: NavigationUpdateOneRankParamDocument) {
        params = Variable.clearAllScriptTags(params);
        params = MongoDBHelpers.convertObjectIdInData(params, navigationObjectIdKeys);

        let filters: mongoose.FilterQuery<NavigationDocument> = {}

        if (params._id) {
            filters = {
                ...filters,
                _id: params._id
            }
        }

        let doc = (await navigationModel.findOne(filters).exec());

        if (doc) {
            doc.rank = params.rank;
            doc.lastAuthorId = params.lastAuthorId;

            await doc.save();
        }

        return {
            _id: doc?._id,
            rank: doc?.rank,
            lastAuthorId: doc?.lastAuthorId
        };
    },
    async updateManyStatus(params: NavigationUpdateManyStatusIdParamDocument) {
        params = Variable.clearAllScriptTags(params);
        params = MongoDBHelpers.convertObjectIdInData(params, navigationObjectIdKeys);

        let filters: mongoose.FilterQuery<NavigationDocument> = {}

        if (params._id) {
            filters = {
                ...filters,
                _id: { $in: params._id }
            }
        }

        return await Promise.all((await navigationModel.find(filters).exec()).map(async doc => {
            doc.statusId = params.statusId;
            doc.lastAuthorId = params.lastAuthorId;

            await doc.save();

            return {
                _id: doc._id,
                statusId: doc.statusId,
                lastAuthorId: doc.lastAuthorId
            };
        }));
    },
    async deleteMany(params: NavigationDeleteManyParamDocument) {
        params = MongoDBHelpers.convertObjectIdInData(params, navigationObjectIdKeys);

        let filters: mongoose.FilterQuery<NavigationDocument> = {}

        filters = {
            ...filters,
            _id: { $in: params._id }
        }

        return (await navigationModel.deleteMany(filters).exec()).deletedCount;
    }
};