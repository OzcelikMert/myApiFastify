import * as mongoose from "mongoose";
import {postTermModel} from "../models/postTerm.model";
import {
    IPostTermDeleteManyParamService,
    IPostTermAddParamService,
    IPostTermGetParamService, IPostTermGetResultService,
    IPostTermUpdateParamService, IPostTermUpdateRankParamService, IPostTermUpdateStatusManyParamService,
    IPostTermGetManyParamService
} from "../types/services/postTerm.service";
import MongoDBHelpers from "../library/mongodb/helpers";
import Variable from "../library/variable";
import { Config } from "../config";
import {postTermObjectIdKeys} from "../constants/objectIdKeys/postTerm.objectIdKeys";
import {postModel} from "../models/post.model";
import { PostTermTypeId } from "../constants/postTermTypes";
import { StatusId } from "../constants/status";
import { IPostTermModel } from "../types/models/postTerm.model";
import {PostTypeId} from "../constants/postTypes";

const createURL = async (_id: string | null, title: string, typeId: PostTermTypeId, postTypeId: PostTypeId) => {
    let urlAlreadyCount = 2;
    let url = title.convertSEOUrl();

    let oldUrl = url;
    while ((await get({
        ignoreTermId: _id ? [_id] : undefined,
        url: url,
        postTypeId: postTypeId,
        typeId: typeId
    }))) {
        url = `${oldUrl}-${urlAlreadyCount}`;
        urlAlreadyCount++;
    }

    return url;
}

const get = async (params: IPostTermGetParamService) => {
    let filters: mongoose.FilterQuery<IPostTermModel> = {}
    params = MongoDBHelpers.convertToObjectIdData(params, [...postTermObjectIdKeys, "ignoreTermId"]);
    let defaultLangId = MongoDBHelpers.convertToObjectId(Config.defaultLangId);

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
        transform: (doc: IPostTermGetResultService) => {
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

    let doc = (await query.lean<IPostTermGetResultService>().exec());

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
}

const getMany = async (params: IPostTermGetManyParamService) => {
    let filters: mongoose.FilterQuery<IPostTermModel> = {}
    params = MongoDBHelpers.convertToObjectIdData(params, [...postTermObjectIdKeys, "ignoreTermId"]);
    let defaultLangId = MongoDBHelpers.convertToObjectId(Config.defaultLangId);

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
        transform: (doc: IPostTermGetResultService) => {
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

    return Promise.all((await query.lean<IPostTermGetResultService[]>().exec()).map(async (doc) => {
        if (Array.isArray(doc.contents)) {
            doc.alternates = doc.contents.map(content => ({
                langId: content.langId.toString(),
                title: content.title,
                url: content.url
            }));

            let docContent = doc.contents.findSingle("langId", params.langId);
            if (!docContent) {
                docContent = doc.contents.findSingle("langId", defaultLangId);
            }

            if (docContent) {
                doc.contents = docContent;
            }
        }

        if (params.withPostCount && doc.typeId == PostTermTypeId.Category) {
            doc.postCount = (await postModel.find({ typeId: doc.postTypeId, categories: { $in: [doc._id] } }).count().exec())
        }

        return doc;
    }))
}

const add = async (params: IPostTermAddParamService) => {
    params = MongoDBHelpers.convertToObjectIdData(params, postTermObjectIdKeys);

    if (Variable.isEmpty(params.mainId)) {
        delete params.mainId;
    }

    if(params.contents){
        params.contents.url = await createURL(null, params.contents.title ?? "", params.typeId, params.postTypeId);
    }

    return (await postTermModel.create(params)).toObject()
}

const update = async (params: IPostTermUpdateParamService) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertToObjectIdData(params, postTermObjectIdKeys);

    let filters: mongoose.FilterQuery<IPostTermModel> = {}

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
                if(docContent.title != params.contents.title){
                    params.contents.url = await createURL(doc._id.toString(), params.contents.title ?? "", params.typeId, params.postTypeId);
                }
                docContent = Object.assign(docContent, params.contents);
            } else {
                params.contents.url = await createURL(doc._id.toString(), params.contents.title ?? "", params.typeId, params.postTypeId);
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
}

const updateRank = async (params: IPostTermUpdateRankParamService) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertToObjectIdData(params, postTermObjectIdKeys);

    let filters: mongoose.FilterQuery<IPostTermModel> = {}

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
}

const updateStatusMany = async (params: IPostTermUpdateStatusManyParamService) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertToObjectIdData(params, postTermObjectIdKeys);

    let filters: mongoose.FilterQuery<IPostTermModel> = {}

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
}

const deleteMany = async (params: IPostTermDeleteManyParamService) => {
    let filters: mongoose.FilterQuery<IPostTermModel> = {}
    params = MongoDBHelpers.convertToObjectIdData(params, postTermObjectIdKeys);

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

export const PostTermService = {
    get: get,
    getMany: getMany,
    add: add,
    update: update,
    updateRank: updateRank,
    updateStatusMany: updateStatusMany,
    deleteMany: deleteMany
};