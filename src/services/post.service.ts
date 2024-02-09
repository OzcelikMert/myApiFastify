import * as mongoose from "mongoose";
import postModel from "../models/post.model";
import {
    PostDeleteManyParamDocument,
    PostAddParamDocument,
    PostGetOneParamDocument,
    PostGetOneResultDocument,
    PostGetManyParamDocument,
    PostUpdateOneParamDocument,
    PostUpdateOneRankParamDocument,
    PostUpdateManyStatusIdParamDocument,
    PostUpdateOneViewParamDocument, PostGetManyResultDocument, PostGetCountParamDocument
} from "../types/services/post.service";
import { PostDocument } from "../types/models/post.model";
import MongoDBHelpers from "../library/mongodb/helpers";
import { PostTermGetResultDocument } from "../types/services/postTerm.service";
import Variable from "../library/variable";
import { Config } from "../config";
import { ComponentGetResultDocument } from "../types/services/component.service";
import {PostObjectIdKeys} from "../constants/objectIdKeys/post.objectIdKeys";
import { StatusId } from "../constants/status";
import { PostTermTypeId } from "../constants/postTermTypes";
import { PostTypeId } from "../constants/postTypes";

const createURL = async (_id: string | null, title: string, typeId: PostTypeId) => {
    let urlAlreadyCount = 2;
    let url = title.convertSEOUrl();

    let oldUrl = url;
    while ((await getOne({
        ignorePostId: _id ? [_id] : undefined,
        url: url,
        typeId: typeId
    }))) {
        url = `${oldUrl}-${urlAlreadyCount}`;
        urlAlreadyCount++;
    }

    return url;
}

const getOne = async (params: PostGetOneParamDocument) => {
    let filters: mongoose.FilterQuery<PostDocument> = {}
    params = MongoDBHelpers.convertObjectIdInData(params, [...PostObjectIdKeys, "ignorePostId"]);
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
    if (params.typeId) {
        filters = {
            ...filters,
            typeId: params.typeId
        }
    }
    if (params.pageTypeId) filters = {
        ...filters,
        pageTypeId: params.pageTypeId
    }
    if (params.statusId) filters = {
        ...filters,
        statusId: params.statusId
    }
    if (params.ignorePostId) {
        filters = {
            ...filters,
            _id: { $nin: params.ignorePostId }
        }
    }

    let query = postModel.findOne(filters);

    query.populate({
        path: [
            "categories",
            "tags"
        ].join(" "),
        select: "_id typeId contents.title contents.langId contents.url contents.image",
        match: {
            typeId: { $in: [PostTermTypeId.Category, PostTermTypeId.Tag] },
            statusId: StatusId.Active,
            postTypeId: params.typeId,
        },
        options: { omitUndefined: true },
        transform: (doc: PostTermGetResultDocument) => {
            if (doc) {
                if (Array.isArray(doc.contents)) {
                    doc.contents = doc.contents.findSingle("langId", params.langId) ?? doc.contents.findSingle("langId", defaultLangId);
                }
            }
            return doc;
        }
    })

    query.populate({
        path: [
            "eCommerce.attributes.attributeId",
            "eCommerce.attributes.variations",
            "eCommerce.variations.selectedVariations.attributeId",
            "eCommerce.variations.selectedVariations.variationId",
            "eCommerce.variationDefaults.attributeId",
            "eCommerce.variationDefaults.variationId",
        ].join(" "),
        select: "_id typeId contents.title contents.langId contents.url contents.image",
        match: {
            typeId: { $in: [PostTermTypeId.Attributes, PostTermTypeId.Variations] },
            statusId: StatusId.Active,
            postTypeId: PostTypeId.Product
        },
        options: { omitUndefined: true },
        transform: (doc: PostTermGetResultDocument) => {
            if (doc) {
                if (Array.isArray(doc.contents)) {
                    doc.contents = doc.contents.findSingle("langId", params.langId) ?? doc.contents.findSingle("langId", defaultLangId);
                }
            }
            return doc;
        }
    })

    query.populate({
        path: "components",
        options: { omitUndefined: true },
        transform: (doc: ComponentGetResultDocument) => {
            if (doc) {
                doc.types.map(docType => {
                    if (Array.isArray(docType.contents)) {
                        docType.contents = docType.contents.findSingle("langId", params.langId) ?? docType.contents.findSingle("langId", defaultLangId);
                    }
                })
            }
            return doc;
        }
    })

    query.populate({
        path: [
            "authorId",
            "lastAuthorId"
        ].join(" "),
        select: "_id name url"
    });

    query.sort({ isFixed: -1, rank: 1, createdAt: -1 });

    let doc = (await query.lean<PostGetOneResultDocument>().exec());

    if (doc) {
        let views = 0;

        if (doc.categories) {
            doc.categories = doc.categories.filter(item => item);
        }

        if (doc.tags) {
            doc.tags = doc.tags.filter(item => item);
        }

        if (doc.components) {
            doc.components = doc.components.filter(item => item);
        }

        if (Array.isArray(doc.contents)) {
            doc.alternates = doc.contents.map(content => ({
                langId: content.langId.toString(),
                title: content.title,
                url: content.url
            }));

            for (const docContent of doc.contents) {
                if (docContent.views) {
                    views += Number(docContent.views);
                }
            }

            let docContent = doc.contents.findSingle("langId", params.langId);
            if (!docContent) {
                docContent = doc.contents.findSingle("langId", defaultLangId);
                if (docContent) {
                    docContent.views = 0;
                }
            }

            doc.contents = docContent;
        }

        if (doc.eCommerce) {
            if (doc.eCommerce.variations) {
                for (let docECommerceVariation of doc.eCommerce.variations) {
                    docECommerceVariation.selectedVariations = docECommerceVariation.selectedVariations.filter(item => item.attributeId);
                    if (Array.isArray(docECommerceVariation.contents)) {
                        docECommerceVariation.contents = docECommerceVariation.contents.findSingle("langId", params.langId) ?? docECommerceVariation.contents.findSingle("langId", defaultLangId);
                    }
                }
            }

            if (doc.eCommerce.variationDefaults) {
                doc.eCommerce.variationDefaults = doc.eCommerce.variationDefaults.filter(item => item.attributeId);
            }

            if (doc.eCommerce.attributes) {
                doc.eCommerce.attributes = doc.eCommerce.attributes.filter(item => item.attributeId);
            }
        }

        doc.views = views;
    }

    return doc;
}

const getMany = async (params: PostGetManyParamDocument) => {
    let filters: mongoose.FilterQuery<PostDocument> = {}
    params = MongoDBHelpers.convertObjectIdInData(params, [...PostObjectIdKeys, "ignorePostId"]);
    let defaultLangId = MongoDBHelpers.createObjectId(Config.defaultLangId);

    if (params._id) filters = {
        ...filters,
        _id: { $in: params._id }
    }
    if (params.authorId) filters = {
        ...filters,
        authorId: params.authorId
    }
    if (params.title) filters = {
        ...filters,
        "contents.title": { $regex: new RegExp(params.title, "i") }
    }
    if (params.typeId) {
        filters = {
            ...filters,
            typeId: { $in: params.typeId }
        }
    }
    if (params.pageTypeId) filters = {
        ...filters,
        pageTypeId: { $in: params.pageTypeId }
    }
    if (params.statusId) filters = {
        ...filters,
        statusId: params.statusId
    }
    if (params.ignorePostId) {
        filters = {
            ...filters,
            _id: { $nin: params.ignorePostId }
        }
    }
    if (params.categories) {
        filters = {
            ...filters,
            categories: { $in: params.categories }
        }
    }

    let query = postModel.find(filters);

    query.populate({
        path: [
            "categories",
            "tags"
        ].join(" "),
        select: "_id typeId contents.title contents.langId contents.url contents.image",
        match: {
            typeId: { $in: [PostTermTypeId.Category, PostTermTypeId.Tag] },
            statusId: StatusId.Active,
            postTypeId: { $in: params.typeId }
        },
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

    if (params.isRecent) {
        query.sort({ createdAt: -1 });
    } else {
        query.sort({ isFixed: -1, rank: 1, createdAt: -1 });
    }

    if (params.page) query.skip((params.count ?? 10) * (params.page > 0 ? params.page - 1 : 0));
    if (params.count) query.limit(params.count);

    return (await query.lean<PostGetManyResultDocument[]>().exec()).map((doc) => {
        let views = 0;

        if (doc.categories) {
            doc.categories = doc.categories.filter(item => item);
        }

        if (doc.tags) {
            doc.tags = doc.tags.filter(item => item);
        }

        if (Array.isArray(doc.contents)) {
            doc.alternates = doc.contents.map(content => ({
                langId: content.langId.toString(),
                title: content.title,
                url: content.url
            }));

            for (const docContent of doc.contents) {
                if (docContent.views) {
                    views += Number(docContent.views);
                }
            }

            let docContent = doc.contents.findSingle("langId", params.langId);
            if (!docContent && !params.ignoreDefaultLanguage) {
                docContent = doc.contents.findSingle("langId", defaultLangId);
                if (docContent) {
                    docContent.views = 0;
                }
            }

            doc.contents = docContent;
            delete doc.contents?.content;
        }

        if (doc.eCommerce) {
            if (doc.eCommerce.variations) {
                doc.eCommerce.variations = doc.eCommerce.variations.filter(variation => {
                    return variation.selectedVariations.every(selectedVariation => {
                        return doc.eCommerce?.variationDefaults?.some(variationDefault => {
                            return variationDefault.attributeId.toString() == selectedVariation.attributeId.toString() &&
                                variationDefault.variationId.toString() == selectedVariation.variationId.toString()
                        })
                    })
                });

                for (let docECommerceVariation of doc.eCommerce.variations) {
                    if (Array.isArray(docECommerceVariation.contents)) {
                        docECommerceVariation.contents = docECommerceVariation.contents.findSingle("langId", params.langId) ?? docECommerceVariation.contents.findSingle("langId", defaultLangId);
                        delete docECommerceVariation.contents?.content;
                    }
                }
            }
            doc.eCommerce.variationDefaults = [];
            doc.eCommerce.attributes = [];
        }

        doc.views = views;

        return doc;
    });
}

const getCount = async (params: PostGetCountParamDocument) => {
    let filters: mongoose.FilterQuery<PostDocument> = { statusId: StatusId.Active }
    params = MongoDBHelpers.convertObjectIdInData(params, PostObjectIdKeys);

    if (params.typeId) {
        filters = {
            ...filters,
            typeId: params.typeId
        }
    }
    if (params.statusId) filters = {
        ...filters,
        statusId: params.statusId
    }
    if (params.title) filters = {
        ...filters,
        "contents.title": { $regex: new RegExp(params.title, "i") }
    }
    if (params.categories) {
        filters = {
            ...filters,
            categories: { $in: params.categories }
        }
    }

    let query = postModel.find(filters);

    return await query.countDocuments().exec();
}

const add = async (params: PostAddParamDocument) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertObjectIdInData(params, PostObjectIdKeys);

    if(params.contents){
        params.contents.url = await createURL(null, params.contents.title ?? "", params.typeId);
    }

    return await postModel.create(params);
}

const updateOne = async (params: PostUpdateOneParamDocument) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertObjectIdInData(params, PostObjectIdKeys);

    let filters: mongoose.FilterQuery<PostDocument> = {}

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

    let doc = (await postModel.findOne(filters).exec());

    if (doc) {
        if (params.contents) {
            if (Array.isArray(doc.contents)) {
                let docContent = doc.contents.findSingle("langId", params.contents.langId);
                if (docContent) {
                    if(docContent.title != params.contents.title){
                        params.contents.url = await createURL(doc._id.toString(), params.contents.title ?? "", params.typeId);
                    }
                    docContent = Object.assign(docContent, params.contents);
                } else {
                    params.contents.url = await createURL(doc._id.toString(), params.contents.title ?? "", params.typeId);
                    doc.contents.push(params.contents)
                }
            }
            delete params.contents;
        }

        doc = Object.assign(doc, params);

        await doc.save();
    }

    return {
        _id: doc?._id,
        pageTypeId: doc?.pageTypeId,
        lastAuthorId: doc?.lastAuthorId
    }
}

const updateOneRank = async (params: PostUpdateOneRankParamDocument) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertObjectIdInData(params, PostObjectIdKeys);

    let filters: mongoose.FilterQuery<PostDocument> = {}

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

    let doc = (await postModel.findOne(filters).exec());

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

const updateOneView = async (params: PostUpdateOneViewParamDocument) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertObjectIdInData(params, PostObjectIdKeys);

    let filters: mongoose.FilterQuery<PostDocument> = {}

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

    let doc = (await postModel.findOne(filters).exec());

    let views = 0,
        totalViews = 0;
    if (doc) {
        let docContent = doc.contents.findSingle("langId", params.langId);
        if (docContent) {
            if (docContent.views) {
                docContent.views = Number(docContent.views) + 1;
            } else {
                docContent.views = 1;
            }

            views = docContent.views;

            await doc.save();
        }

        for (const docContent of doc.contents) {
            if (docContent.views) {
                totalViews += Number(docContent.views);
            }
        }
    }

    return {
        _id: doc?._id,
        langId: params.langId,
        views: views,
        totalViews: totalViews
    };
}

const updateManyStatus = async (params: PostUpdateManyStatusIdParamDocument) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertObjectIdInData(params, PostObjectIdKeys);

    let filters: mongoose.FilterQuery<PostDocument> = {}

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

    return await Promise.all((await postModel.find(filters).exec()).map(async doc => {
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

const deleteMany = async (params: PostDeleteManyParamDocument) => {
    let filters: mongoose.FilterQuery<PostDocument> = {}
    params = MongoDBHelpers.convertObjectIdInData(params, PostObjectIdKeys);

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

    return (await postModel.deleteMany(filters).exec()).deletedCount;
}

export default {
    getOne: getOne,
    getMany: getMany,
    getCount: getCount,
    add: add,
    updateOne: updateOne,
    updateOneRank: updateOneRank,
    updateOneView: updateOneView,
    updateManyStatus: updateManyStatus,
    deleteMany: deleteMany
};