import * as mongoose from "mongoose";
import MongoDBHelpers from "../library/mongodb/helpers";
import Variable from "../library/variable";
import { Config } from "../config";
import {navigationObjectIdKeys} from "../constants/objectIdKeys/navigation.objectIdKeys";
import {
    INavigationDeleteManyParamService,
    INavigationAddParamService,
    INavigationGetParamService,
    INavigationGetResultService,
    INavigationUpdateParamService,
    INavigationUpdateRankParamService,
    INavigationUpdateStatusManyParamService, INavigationGetManyParamService
} from "../types/services/navigation.service";
import {navigationModel} from "../models/navigation.model";
import { StatusId } from "../constants/status";
import { INavigationModel } from "../types/models/navigation.model";

const get = async (params: INavigationGetParamService) => {
    let filters: mongoose.FilterQuery<INavigationModel> = {}
    params = MongoDBHelpers.convertToObjectIdData(params, navigationObjectIdKeys);
    let defaultLangId = MongoDBHelpers.convertToObjectId(Config.defaultLangId);

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
        transform: (doc: INavigationGetResultService) => {
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
        select: "_id name url image"
    })

    query.sort({rank: "asc", createdAt: "desc"});

    let doc = (await query.lean<INavigationGetResultService>().exec());

    if (doc) {
        if (Array.isArray(doc.contents)) {
            doc.alternates = doc.contents.map(content => ({
                langId: content.langId.toString()
            }));

            let docContent = doc.contents.findSingle("langId", params.langId) ?? doc.contents.findSingle("langId", defaultLangId);
            if (docContent) {
                doc.contents = docContent;
            }
        }
    }

    return doc
}

const getMany = async (params: INavigationGetManyParamService) => {
    let filters: mongoose.FilterQuery<INavigationModel> = {}
    params = MongoDBHelpers.convertToObjectIdData(params, navigationObjectIdKeys);
    let defaultLangId = MongoDBHelpers.convertToObjectId(Config.defaultLangId);

    if (params._id) filters = {
        ...filters,
        _id: { $in: params._id }
    }
    if (params.statusId) filters = {
        ...filters,
        statusId: params.statusId
    }
    if (typeof params.isPrimary !== "undefined") filters = {
        ...filters,
        isPrimary: params.isPrimary
    }
    if (typeof params.isSecondary !== "undefined") filters = {
        ...filters,
        isSecondary: params.isSecondary
    }

    let query = navigationModel.find(filters);

    query.populate({
        path: "mainId",
        select: "_id contents.title contents.url contents.langId",
        match: { statusId: StatusId.Active },
        options: { omitUndefined: true },
        transform: (doc: INavigationGetResultService) => {
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
        select: "_id name url image"
    })

    query.sort({rank: "asc", createdAt: "desc"});

    return (await query.lean<INavigationGetResultService[]>().exec()).map((doc) => {
        if (Array.isArray(doc.contents)) {
            doc.alternates = doc.contents.map(content => ({
                langId: content.langId.toString()
            }));

            let docContent = doc.contents.findSingle("langId", params.langId);
            if (!docContent) {
                docContent = doc.contents.findSingle("langId", defaultLangId);
            }

            if (docContent) {
                doc.contents = docContent;
            }
        }

        return doc;
    });
}

const add = async (params: INavigationAddParamService) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertToObjectIdData(params, navigationObjectIdKeys);

    return (await navigationModel.create(params)).toObject();
}

const update = async (params: INavigationUpdateParamService) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertToObjectIdData(params, navigationObjectIdKeys);
    let filters: mongoose.FilterQuery<INavigationModel> = {}

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

        await doc.save();
    }

    return {
        _id: doc?._id,
        lastAuthorId: doc?.lastAuthorId
    }
}

const updateRank = async (params: INavigationUpdateRankParamService) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertToObjectIdData(params, navigationObjectIdKeys);

    let filters: mongoose.FilterQuery<INavigationModel> = {}

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
}

const updateStatusMany = async (params: INavigationUpdateStatusManyParamService) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertToObjectIdData(params, navigationObjectIdKeys);

    let filters: mongoose.FilterQuery<INavigationModel> = {}

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
}

const deleteMany = async (params: INavigationDeleteManyParamService) => {
    params = MongoDBHelpers.convertToObjectIdData(params, navigationObjectIdKeys);

    let filters: mongoose.FilterQuery<INavigationModel> = {}

    filters = {
        ...filters,
        _id: { $in: params._id }
    }

    return (await navigationModel.deleteMany(filters).exec()).deletedCount;
}

export const NavigationService = {
    get: get,
    getMany: getMany,
    add: add,
    update: update,
    updateRank: updateRank,
    updateStatusMany: updateStatusMany,
    deleteMany: deleteMany
};