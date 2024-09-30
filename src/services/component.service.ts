import * as mongoose from "mongoose";
import {Config} from "@configs/index";
import {
    IComponentAddParamService,
    IComponentDeleteManyParamService,
    IComponentGetDetailedParamService,
    IComponentGetManyDetailedParamService,
    IComponentGetManyParamService,
    IComponentGetParamService,
    IComponentGetDetailedResultService,
    IComponentUpdateParamService
} from "types/services/component.service";
import {IComponentModel} from "types/models/component.model";
import {componentObjectIdKeys} from "@constants/objectIdKeys/component.objectIdKeys";
import {componentModel} from "@models/component.model";
import {MongoDBHelpers} from "@library/mongodb/helpers";
import {VariableLibrary} from "@library/variable";

const get = async (params: IComponentGetParamService) => {
    let filters: mongoose.FilterQuery<IComponentModel> = {}
    params = MongoDBHelpers.convertToObjectIdData(params, componentObjectIdKeys);
    let defaultLangId = MongoDBHelpers.convertToObjectId(Config.defaultLangId);

    if (params._id) filters = {
        ...filters,
        _id: params._id
    }
    if (params.key) filters = {
        ...filters,
        key: params.key
    }

    let query = componentModel.findOne(filters);

    query.sort({rank: "asc", _id: "desc"});

    let doc = (await query.lean<IComponentModel>().exec());

    if (doc) {
        for (let docElement of doc.elements) {
            docElement.contents = [];
        }
    }

    return doc;
}

const getMany = async (params: IComponentGetManyParamService) => {
    let filters: mongoose.FilterQuery<IComponentModel> = {}
    params = MongoDBHelpers.convertToObjectIdData(params, componentObjectIdKeys);
    let defaultLangId = MongoDBHelpers.convertToObjectId(Config.defaultLangId);

    if (params._id) filters = {
        ...filters,
        _id: params._id
    }
    if (params.key) filters = {
        ...filters,
        key: {$in: params.key}
    }
    if (params.typeId) filters = {
        ...filters,
        typeId: {$in: params.typeId}
    }

    let query = componentModel.find(filters);

    query.sort({rank: "asc", _id: "desc"});

    let docs = (await query.lean<IComponentModel[]>().exec());

    return docs.map(doc => {
        for (let docElement of doc.elements) {
            docElement.contents = [];
        }

        return doc;
    });
}

const getDetailed = async (params: IComponentGetDetailedParamService) => {
    let filters: mongoose.FilterQuery<IComponentModel> = {}
    params = MongoDBHelpers.convertToObjectIdData(params, componentObjectIdKeys);
    let defaultLangId = MongoDBHelpers.convertToObjectId(Config.defaultLangId);

    if (params._id) filters = {
        ...filters,
        _id: params._id
    }
    if (params.key) filters = {
        ...filters,
        key: params.key
    }

    let query = componentModel.findOne(filters);

    query.populate({
        path: [
            "authorId",
            "lastAuthorId"
        ].join(" "),
        select: "_id name url image",
        options: {omitUndefined: true},
    });

    query.sort({rank: "asc", _id: "desc"});

    let doc = (await query.lean<IComponentGetDetailedResultService>().exec());

    if (doc) {
        for (let docElement of doc.elements) {
            if (Array.isArray(docElement.contents)) {
                docElement.alternates = docElement.contents.map(content => ({
                    langId: content.langId.toString()
                }));

                docElement.contents = docElement.contents.findSingle("langId", params.langId) ?? docElement.contents.findSingle("langId", defaultLangId);
            }
        }
    }

    return doc;
}

const getManyDetailed = async (params: IComponentGetManyDetailedParamService) => {
    let filters: mongoose.FilterQuery<IComponentModel> = {}
    params = MongoDBHelpers.convertToObjectIdData(params, componentObjectIdKeys);
    let defaultLangId = MongoDBHelpers.convertToObjectId(Config.defaultLangId);

    if (params._id) filters = {
        ...filters,
        _id: params._id
    }
    if (params.key) filters = {
        ...filters,
        key: {$in: params.key}
    }
    if (params.typeId) filters = {
        ...filters,
        typeId: {$in: params.typeId}
    }

    let query = componentModel.find(filters);

    query.populate({
        path: [
            "authorId",
            "lastAuthorId"
        ].join(" "),
        select: "_id name url image",
        options: {omitUndefined: true},
    })

    if(!params.withCustomSort){
        query.sort({rank: "asc", _id: "desc"});
    }

    let docs = (await query.lean<IComponentGetDetailedResultService[]>().exec());

    return docs.map(doc => {
        for (let docElement of doc.elements) {
            if (Array.isArray(docElement.contents)) {
                docElement.alternates = docElement.contents.map(content => ({
                    langId: content.langId.toString()
                }));

                docElement.contents = docElement.contents.findSingle("langId", params.langId) ?? docElement.contents.findSingle("langId", defaultLangId);
                if (docElement.contents) {
                    if(!params.withContent){
                        delete docElement.contents?.content;
                    }
                }
            }
        }

        return doc;
    });
}

const add = async (params: IComponentAddParamService) => {
    params = VariableLibrary.clearAllScriptTags(params);
    params = MongoDBHelpers.convertToObjectIdData(params, componentObjectIdKeys);

    return (await componentModel.create(params)).toObject()

}

const update = async (params: IComponentUpdateParamService) => {
    params = VariableLibrary.clearAllScriptTags(params);
    params = MongoDBHelpers.convertToObjectIdData(params, componentObjectIdKeys);

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
    params = MongoDBHelpers.convertToObjectIdData(params, componentObjectIdKeys);

    filters = {
        ...filters,
        _id: {$in: params._id}
    }

    return (await componentModel.deleteMany(filters).exec()).deletedCount;
}

export const ComponentService = {
    get: get,
    getMany: getMany,
    getDetailed: getDetailed,
    getManyDetailed: getManyDetailed,
    add: add,
    update: update,
    deleteMany: deleteMany
};