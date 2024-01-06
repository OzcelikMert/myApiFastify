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
import postObjectIdKeys from "../constants/objectIdKeys/post.objectIdKeys";
import { StatusId } from "../constants/status";
import { PostTermTypeId } from "../constants/postTermTypes";
import { PostTypeId } from "../constants/postTypes";

export default {
    async getOne(params: PostGetOneParamDocument) {
        let filters: mongoose.FilterQuery<PostDocument> = {}
        params = MongoDBHelpers.convertObjectIdInData(params, [...postObjectIdKeys, "ignorePostId"]);
        let defaultLangId = MongoDBHelpers.createObjectId(Config.defaultLangId);

        if (params._id) filters = {
            ...filters,
            _id: params._id
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

        let query = postModel.findOne(filters).populate<{ categories: PostGetOneResultDocument["categories"], tags: PostGetOneResultDocument["tags"] }>({
            path: [
                "categories",
                "tags"
            ].join(" "),
            select: "_id typeId contents.title contents.langId contents.url contents.image",
            match: {
                typeId: { $in: [PostTermTypeId.Category, PostTermTypeId.Tag] },
                statusId: StatusId.Active,
                postTypeId: params.typeId
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
        }).populate<{ eCommerce: PostGetOneResultDocument["eCommerce"] }>({
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
        }).populate<{ components: PostGetOneResultDocument["components"] }>({
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
        }).populate<{ authorId: PostGetOneResultDocument["authorId"], lastAuthorId: PostGetOneResultDocument["lastAuthorId"] }>({
            path: [
                "authorId",
                "lastAuthorId"
            ].join(" "),
            select: "_id name url"
        });

        query.sort({ isFixed: -1, rank: 1, createdAt: -1 });

        let doc = (await query.lean().exec()) as PostGetOneResultDocument | null;

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
                    langId: content.langId,
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
    },
    async getMany(params: PostGetManyParamDocument) {
        let filters: mongoose.FilterQuery<PostDocument> = {}
        params = MongoDBHelpers.convertObjectIdInData(params, [...postObjectIdKeys, "ignorePostId"]);
        let defaultLangId = MongoDBHelpers.createObjectId(Config.defaultLangId);

        if (params._id) filters = {
            ...filters,
            _id: { $in: params._id }
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

        let query = postModel.find(filters).populate<{ categories: PostGetManyResultDocument["categories"], tags: PostGetManyResultDocument["tags"] }>({
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
        }).populate<{ authorId: PostGetManyResultDocument["authorId"], lastAuthorId: PostGetManyResultDocument["lastAuthorId"] }>({
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

        return (await query.lean().exec()).map((doc: PostGetManyResultDocument) => {
            let views = 0;

            if (doc.categories) {
                doc.categories = doc.categories.filter(item => item);
            }

            if (doc.tags) {
                doc.tags = doc.tags.filter(item => item);
            }

            if (Array.isArray(doc.contents)) {
                doc.alternates = doc.contents.map(content => ({
                    langId: content.langId,
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
    },
    async getCount(params: PostGetCountParamDocument) {
        let filters: mongoose.FilterQuery<PostDocument> = { statusId: StatusId.Active }
        params = MongoDBHelpers.convertObjectIdInData(params, postObjectIdKeys);

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
    },
    async add(params: PostAddParamDocument) {
        params = Variable.clearAllScriptTags(params);
        params = MongoDBHelpers.convertObjectIdInData(params, postObjectIdKeys);

        return await postModel.create(params);
    },
    async updateOne(params: PostUpdateOneParamDocument) {
        params = Variable.clearAllScriptTags(params);
        params = MongoDBHelpers.convertObjectIdInData(params, postObjectIdKeys);

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
                        docContent = Object.assign(docContent, params.contents);
                    } else {
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
    },
    async updateOneRank(params: PostUpdateOneRankParamDocument) {
        params = Variable.clearAllScriptTags(params);
        params = MongoDBHelpers.convertObjectIdInData(params, postObjectIdKeys);

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
    },
    async updateOneView(params: PostUpdateOneViewParamDocument) {
        params = Variable.clearAllScriptTags(params);
        params = MongoDBHelpers.convertObjectIdInData(params, postObjectIdKeys);

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
    },
    async updateManyStatus(params: PostUpdateManyStatusIdParamDocument) {
        params = Variable.clearAllScriptTags(params);
        params = MongoDBHelpers.convertObjectIdInData(params, postObjectIdKeys);

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
    },
    async deleteMany(params: PostDeleteManyParamDocument) {
        let filters: mongoose.FilterQuery<PostDocument> = {}
        params = MongoDBHelpers.convertObjectIdInData(params, postObjectIdKeys);

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
};