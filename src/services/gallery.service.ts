import * as mongoose from "mongoose";
import {MongoDBHelpers} from "@library/mongodb/helpers";
import {VariableLibrary} from "@library/variable";
import {galleryObjectIdKeys} from "@constants/objectIdKeys/gallery.objectIdKeys";
import {IGalleryModel} from "types/models/gallery.model";
import {
    IGalleryAddParamService, IGalleryDeleteManyParamService,
    IGalleryGetManyParamService, IGalleryGetParamService,
    IGalleryGetResultService
} from "types/services/gallery.service";
import {galleryModel} from "@models/gallery.model";

const get = async (params: IGalleryGetParamService) => {
    let filters: mongoose.FilterQuery<IGalleryModel> = {}
    params = MongoDBHelpers.convertToObjectIdData(params, galleryObjectIdKeys);

    if (params._id) filters = {
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
        select: "_id name url image"
    });

    query.sort({createdAt: "desc"});

    return (await query.lean<IGalleryGetResultService>().exec());
}

const getMany = async (params: IGalleryGetManyParamService) => {
    let filters: mongoose.FilterQuery<IGalleryModel> = {}
    params = MongoDBHelpers.convertToObjectIdData(params, galleryObjectIdKeys);

    if (params._id) filters = {
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
        select: "_id name url image"
    });

    query.sort({createdAt: "desc"});

    return (await query.lean<IGalleryGetResultService[]>().exec());
}

const add = async (params: IGalleryAddParamService) => {
    params = VariableLibrary.clearAllScriptTags(params);
    params = MongoDBHelpers.convertToObjectIdData(params, galleryObjectIdKeys);

    return (await galleryModel.create(params)).toObject();
}

const deleteMany = async (params: IGalleryDeleteManyParamService) => {
    let filters: mongoose.FilterQuery<IGalleryModel> = {};
    params = MongoDBHelpers.convertToObjectIdData(params, galleryObjectIdKeys);

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

export const GalleryService = {
    get: get,
    getMany: getMany,
    add: add,
    deleteMany: deleteMany
};