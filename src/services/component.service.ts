import * as mongoose from "mongoose";
import MongoDBHelpers from "../library/mongodb/helpers";
import { Config } from "../config";
import Variable from "../library/variable";
import {
    IComponentAddParamService, IComponentDeleteManyParamService,
    IComponentGetManyParamService,
    IComponentGetParamService,
    IComponentGetResultService, IComponentUpdateParamService
} from "../types/services/component.service";
import {IComponentModel} from "../types/models/component.model";
import {componentObjectIdKeys} from "../constants/objectIdKeys/component.objectIdKeys";
import {componentModel} from "../models/component.model";

const get = async (params: IComponentGetParamService) => {
    let filters: mongoose.FilterQuery<IComponentModel> = {}
    params = MongoDBHelpers.convertObjectIdInData(params, componentObjectIdKeys);
    let defaultLangId = MongoDBHelpers.createObjectId(Config.defaultLangId);

    if (params._id) filters = {
        ...filters,
        _id: params._id
    }
    if (params.elementId) filters = {
        ...filters,
        elementId: params.elementId
    }

    let query = componentModel.findOne(filters);

    query.populate({
        path: [
            "authorId",
            "lastAuthorId"
        ].join(" "),
        select: "_id name url"
    });

    query.sort({ rank: 1, createdAt: -1 });

    let doc = (await query.lean<IComponentGetResultService>().exec());

    if (doc) {
        for (let docElement of doc.elements) {
            if (Array.isArray(docElement.contents)) {
                docElement.contents = docElement.contents.findSingle("langId", params.langId) ?? docElement.contents.findSingle("langId", defaultLangId);
            }
        }
    }

    return doc;
}

const getMany = async (params: IComponentGetManyParamService) => {
    let filters: mongoose.FilterQuery<IComponentModel> = {}
    params = MongoDBHelpers.convertObjectIdInData(params, componentObjectIdKeys);
    let defaultLangId = MongoDBHelpers.createObjectId(Config.defaultLangId);

    if (params._id) filters = {
        ...filters,
        _id: params._id
    }

    if (params.elementId) filters = {
        ...filters,
        elementId: { $in: params.elementId }
    }

    let query = componentModel.find(filters);

    query.populate({
        path: [
            "authorId",
            "lastAuthorId"
        ].join(" "),
        select: "_id name url"
    })

    query.sort({ rank: 1, createdAt: -1 });

    return (await query.lean<IComponentGetResultService[]>().exec()).map(doc => {
        for (let docElement of doc.elements) {
            if (Array.isArray(docElement.contents)) {
                docElement.contents = docElement.contents.findSingle("langId", params.langId) ?? docElement.contents.findSingle("langId", defaultLangId);
                if(docElement.contents){
                    delete docElement.contents?.content;
                }
            }
        }

        return doc;
    });
}

const add = async (params: IComponentAddParamService) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertObjectIdInData(params, componentObjectIdKeys);

    return (await componentModel.create(params)).toObject()

}

const update = async (params: IComponentUpdateParamService) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertObjectIdInData(params, componentObjectIdKeys);

    let filters: mongoose.FilterQuery<IComponentModel> = {}

    if (params._id) {
        filters = {
            _id: params._id
        };
    }

    let doc = (await componentModel.findOne(filters).exec());

    if (doc) {
        if (params.elements) {
            // Check delete
            doc.elements = doc.elements.filter(docElement => params.elements && params.elements.indexOfKey("_id", docElement._id) > -1)
            // Check Update
            for (let paramElement of params.elements) {
                let docElement = doc.elements.findSingle("_id", paramElement._id);
                if (docElement) {
                    let docElementContent = docElement.contents.findSingle("langId", paramElement.contents.langId);
                    if (docElementContent) {
                        docElementContent = Object.assign(docElementContent, paramElement.contents);
                    } else {
                        docElement.contents.push(paramElement.contents)
                    }
                    docElement = Object.assign(docElement, {
                        ...paramElement,
                        contents: docElement.contents
                    })
                } else {
                    doc.elements.push({
                        ...paramElement,
                        contents: [paramElement.contents]
                    })
                }
            }
            delete params.elements;
        }

        doc = Object.assign(doc, params);

        await doc.save();
    }

    return params;
}

const deleteMany = async (params: IComponentDeleteManyParamService) => {
    let filters: mongoose.FilterQuery<IComponentModel> = {}
    params = MongoDBHelpers.convertObjectIdInData(params, componentObjectIdKeys);

    filters = {
        ...filters,
        _id: { $in: params._id }
    }

    return (await componentModel.deleteMany(filters).exec()).deletedCount;
}

export const ComponentService = {
    get: get,
    getMany: getMany,
    add: add,
    update: update,
    deleteMany: deleteMany
};