import * as mongoose from "mongoose";
import MongoDBHelpers from "../library/mongodb/helpers";
import Variable from "../library/variable";
import galleryObjectIdKeys from "../constants/objectIdKeys/gallery.objectIdKeys";
import {GalleryDocument} from "../types/models/gallery.model";
import {
    GalleryAddParamDocument, GalleryDeleteManyParamDocument,
    GalleryGetManyParamDocument, GalleryGetOneParamDocument,
    GalleryGetResultDocument
} from "../types/services/gallery.service";
import galleryModel from "../models/gallery.model";

const getOne = async (params: GalleryGetOneParamDocument) => {
    let filters: mongoose.FilterQuery<GalleryDocument> = {}
    params = MongoDBHelpers.convertObjectIdInData(params, galleryObjectIdKeys);

    if (params.name) filters = {
        ...filters,
        _id: params._id
    }
    if (params.name) filters = {
        ...filters,
        name: params.name
    }
    if (params.authorId) filters = {
        ...filters,
        authorId: params.authorId
    }

    let query = galleryModel.findOne(filters);

    query.populate({
        path: [
            "authorId",
        ].join(" "),
        select: "_id name url"
    });

    query.sort({ createdAt: -1 });

    return (await query.lean<GalleryGetResultDocument>().exec());
}

const getMany = async (params: GalleryGetManyParamDocument) => {
    let filters: mongoose.FilterQuery<GalleryDocument> = {}
    params = MongoDBHelpers.convertObjectIdInData(params, galleryObjectIdKeys);

    if (params.name) filters = {
        ...filters,
        _id: { $in: params._id }
    }
    if (params.name) filters = {
        ...filters,
        name: { $in: params.name }
    }
    if (params.authorId) filters = {
        ...filters,
        authorId: params.authorId
    }
    if (params.typeId) filters = {
        ...filters,
        typeId: params.typeId
    }

    let query = galleryModel.find(filters);

    query.populate({
        path: [
            "authorId",
        ].join(" "),
        select: "_id name url"
    });

    query.sort({ createdAt: -1 });

    return (await query.lean<GalleryGetResultDocument[]>().exec());
}

const add = async (params: GalleryAddParamDocument) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertObjectIdInData(params, galleryObjectIdKeys);

    return await galleryModel.create(params);
}

const deleteMany = async (params: GalleryDeleteManyParamDocument) => {
    let filters: mongoose.FilterQuery<GalleryDocument> = {};
    params = MongoDBHelpers.convertObjectIdInData(params, galleryObjectIdKeys);

    if (params._id) filters = {
        ...filters,
        _id: { $in: params._id }
    }
    if (params.authorId) filters = {
        ...filters,
        authorId: params.authorId
    }

    return (await galleryModel.deleteMany(filters).exec()).deletedCount;
}

export default {
    getOne: getOne,
    getMany: getMany,
    add: add,
    deleteMany: deleteMany
};