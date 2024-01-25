import * as mongoose from "mongoose";
import postTermModel from "../models/postTerm.model";
import {
    PostTermDeleteManyParamDocument,
    PostTermAddParamDocument,
    PostTermGetOneParamDocument, PostTermGetResultDocument,
    PostTermUpdateOneParamDocument, PostTermUpdateOneRankParamDocument, PostTermUpdateManyStatusIdParamDocument,
    PostTermGetManyParamDocument
} from "../types/services/postTerm.service";
import MongoDBHelpers from "../library/mongodb/helpers";
import Variable from "../library/variable";
import { Config } from "../config";
import postTermObjectIdKeys from "../constants/objectIdKeys/postTerm.objectIdKeys";
import postModel from "../models/post.model";
import { PostTermTypeId } from "../constants/postTermTypes";
import { StatusId } from "../constants/status";
import { PostTermDocument } from "../types/models/postTerm.model";

export default {
    async getOne(params: PostTermGetOneParamDocument) {
        let filters: mongoose.FilterQuery<PostTermDocument> = {}
        params = MongoDBHelpers.convertObjectIdInData(params, [...postTermObjectIdKeys, "ignoreTermId"]);
        let defaultLangId = MongoDBHelpers.createObjectId(Config.defaultLangId);

        if (params._id) filters = {
            ...filters,
            _id: params._id
        }
        if (params.authorId) filters = {
            ...filters,
            authorId: params.authorId
        }
        if (params.url) filters = {
            ...filters,
            "contents.url": params.url
        }
        if (params.typeId) filters = {
            ...filters,
            typeId: params.typeId
        }
        if (params.statusId) filters = {
            ...filters,
            statusId: params.statusId
        }
        if (params.postTypeId) filters = {
            ...filters,
            postTypeId: params.postTypeId
        }
        if (params.ignoreTermId) {
            filters = {
                ...filters,
                _id: { $nin: params.ignoreTermId }
            }
        }

        let query = postTermModel.findOne(filters);

        query.populate({
            path: "mainId",
            select: "_id typeId contents.title contents.langId contents.url contents.image",
            match: { statusId: StatusId.Active },
            options: { omitUndefined: true },
            transform: (doc: PostTermGetResultDocument) => {
                if (doc) {
                    if (Array.isArray(doc.contents)) {
                        doc.contents = doc.contents.findSingle("langId", params.langId) ?? doc.contents.findSingle("langId", defaultLangId);
                    }
                }
                return doc;
            }
        });

        query.populate({
            path: [
                "authorId",
                "lastAuthorId"
            ].join(" "),
            select: "_id name url"
        });

        query.sort({ rank: 1, createdAt: -1 });

        let doc = (await query.lean<PostTermGetResultDocument>().exec());

        if (doc) {
            if (Array.isArray(doc.contents)) {
                doc.alternates = doc.contents.map(content => ({
                    langId: content.langId.toString(),
                    title: content.title,
                    url: content.url
                }));
                doc.contents = doc.contents.findSingle("langId", params.langId) ?? doc.contents.findSingle("langId", defaultLangId);
            }
        }

        return doc;
    },
    async getMany(params: PostTermGetManyParamDocument) {
        let filters: mongoose.FilterQuery<PostTermDocument> = {}
        params = MongoDBHelpers.convertObjectIdInData(params, [...postTermObjectIdKeys, "ignoreTermId"]);
        let defaultLangId = MongoDBHelpers.createObjectId(Config.defaultLangId);

        if (params._id) filters = {
            ...filters,
            _id: params._id
        }
        if (params.authorId) filters = {
            ...filters,
            authorId: params.authorId
        }
        if (params.url) filters = {
            ...filters,
            "contents.url": params.url
        }
        if (params.title) filters = {
            ...filters,
            "contents.title": { $regex: new RegExp(params.title, "i") }
        }
        if (params.typeId) filters = {
            ...filters,
            typeId: { $in: params.typeId }
        }
        if (params.statusId) filters = {
            ...filters,
            statusId: params.statusId
        }
        if (params.postTypeId) filters = {
            ...filters,
            postTypeId: params.postTypeId
        }
        if (params.ignoreTermId) {
            filters = {
                ...filters,
                _id: { $nin: params.ignoreTermId }
            }
        }

        let query = postTermModel.find(filters);

        query.populate({
            path: "mainId",
            select: "_id typeId contents.title contents.langId contents.url contents.image",
            match: { statusId: StatusId.Active },
            options: { omitUndefined: true },
            transform: (doc: PostTermGetResultDocument) => {
                if (doc) {
                    if (Array.isArray(doc.contents)) {
                        doc.contents = doc.contents.findSingle("langId", params.langId) ?? doc.contents.findSingle("langId", defaultLangId);
                    }
                }
                return doc;
            }
        });

        query.populate({
            path: [
                "authorId",
                "lastAuthorId"
            ].join(" "),
            select: "_id name url"
        })

        if (params.page) query.skip((params.count ?? 10) * (params.page > 0 ? params.page - 1 : 0));
        if (params.count) query.limit(params.count);

        query.sort({ rank: 1, createdAt: -1 });

        return Promise.all((await query.lean<PostTermGetResultDocument[]>().exec()).map(async (doc) => {
            if (Array.isArray(doc.contents)) {
                doc.alternates = doc.contents.map(content => ({
                    langId: content.langId.toString(),
                    title: content.title,
                    url: content.url
                }));

                let docContent = doc.contents.findSingle("langId", params.langId);
                if (!docContent && !params.ignoreDefaultLanguage) {
                    docContent = doc.contents.findSingle("langId", defaultLangId);
                }

                if (docContent) {
                    doc.contents = docContent;
                }
            }

            if (params.withPostCount && [PostTermTypeId.Category].includes(doc.typeId)) {
                doc.postCount = (await postModel.find({ typeId: doc.postTypeId, categories: { $in: [doc._id] } }).count().exec())
            }

            return doc;
        }))
    },
    async add(params: PostTermAddParamDocument) {
        params = MongoDBHelpers.convertObjectIdInData(params, postTermObjectIdKeys);

        if (Variable.isEmpty(params.mainId)) {
            delete params.mainId;
        }

        return await postTermModel.create(params)
    },
    async updateOne(params: PostTermUpdateOneParamDocument) {
        params = Variable.clearAllScriptTags(params);
        params = MongoDBHelpers.convertObjectIdInData(params, postTermObjectIdKeys);

        let filters: mongoose.FilterQuery<PostTermDocument> = {}

        if (params._id) {
            filters = {
                _id: params._id
            };
        }
        if (params.typeId) {
            filters = {
                ...filters,
                typeId: params.typeId
            }
        }
        if (params.postTypeId) filters = {
            ...filters,
            postTypeId: params.postTypeId
        }

        let doc = (await postTermModel.findOne(filters).exec());

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
        };
    },
    async updateOneRank(params: PostTermUpdateOneRankParamDocument) {
        params = Variable.clearAllScriptTags(params);
        params = MongoDBHelpers.convertObjectIdInData(params, postTermObjectIdKeys);

        let filters: mongoose.FilterQuery<PostTermDocument> = {}

        if (params._id) {
            filters = {
                ...filters,
                _id: params._id
            }
        }
        if (params.typeId) {
            filters = {
                ...filters,
                typeId: params.typeId
            }
        }
        if (params.postTypeId) filters = {
            ...filters,
            postTypeId: params.postTypeId
        }

        let doc = (await postTermModel.findOne(filters).exec());

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
    async updateManyStatus(params: PostTermUpdateManyStatusIdParamDocument) {
        params = Variable.clearAllScriptTags(params);
        params = MongoDBHelpers.convertObjectIdInData(params, postTermObjectIdKeys);

        let filters: mongoose.FilterQuery<PostTermDocument> = {}

        if (params._id) {
            filters = {
                ...filters,
                _id: { $in: params._id }
            }
        }
        if (params.typeId) {
            filters = {
                ...filters,
                typeId: params.typeId
            }
        }
        if (params.postTypeId) filters = {
            ...filters,
            postTypeId: params.postTypeId
        }

        return await Promise.all((await postTermModel.find(filters).exec()).map(async doc => {
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
    async deleteMany(params: PostTermDeleteManyParamDocument) {
        let filters: mongoose.FilterQuery<PostTermDocument> = {}
        params = MongoDBHelpers.convertObjectIdInData(params, postTermObjectIdKeys);

        filters = {
            ...filters,
            _id: { $in: params._id }
        }
        if (params.typeId) {
            filters = {
                ...filters,
                typeId: params.typeId
            }
        }
        if (params.postTypeId) {
            filters = {
                ...filters,
                postTypeId: params.postTypeId
            }
        }

        return (await postTermModel.deleteMany(filters).exec()).deletedCount;
    }
};