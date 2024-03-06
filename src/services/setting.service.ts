import * as mongoose from "mongoose";
import {settingModel} from "../models/setting.model";
import {
    ISettingAddParamService,
    ISettingGetParamService,
    ISettingGetResultService,
    ISettingUpdateStaticContentParamService,
    ISettingUpdateSocialMediaParamService,
    ISettingUpdateSEOParamService,
    ISettingUpdateContactFormParamService,
    ISettingUpdateECommerceParamService,
    ISettingUpdateGeneralParamService
} from "../types/services/setting.service";
import MongoDBHelpers from "../library/mongodb/helpers";
import Variable from "../library/variable";
import {Config} from "../config";
import {settingObjectIdKeys} from "../constants/objectIdKeys/setting.objectIdKeys";
import {ISettingModel} from "../types/models/setting.model";

const get = async (params: ISettingGetParamService, withPassword: boolean = false) => {
    let filters: mongoose.FilterQuery<ISettingModel> = {}
    let projection: mongoose.ProjectionType<ISettingModel> = {contactForms: 0};

    params = MongoDBHelpers.convertObjectIdInData(params, settingObjectIdKeys);
    let defaultLangId = MongoDBHelpers.createObjectId(Config.defaultLangId);

    if(params.projection){
        switch (params.projection) {
            case "general": projection = {eCommerce: 0, staticContents: 0, socialMedia: 0, contactForms: 0, seoContents: 0}; break;
            case "seo": projection = {seoContents: 1}; break;
            case "contactForm": projection = {contactForms: 1}; break;
            case "eCommerce": projection = {eCommerce: 1}; break;
            case "staticContent": projection = {staticContents: 1}; break;
            case "socialMedia": projection = {socialMedia: 1}; break;
        }
    }

    let query = settingModel.findOne(filters, projection);

    let doc = (await query.lean<ISettingGetResultService>().exec());

    if(doc){
        if (Array.isArray(doc.seoContents)) {
            doc.seoContents = doc.seoContents.findSingle("langId", params.langId) ?? doc.seoContents.findSingle("langId", defaultLangId);
        }

        if (Array.isArray(doc.staticContents)) {
            doc.staticContents = doc.staticContents.map(staticContent => {
                if(Array.isArray(staticContent.contents)){
                    staticContent.contents = staticContent.contents.findSingle("langId", params.langId) ?? staticContent.contents.findSingle("langId", defaultLangId);
                }
                return staticContent;
            })
        }

        if (!withPassword && doc.contactForms) {
            doc.contactForms.map(contactForm => {
                delete contactForm.password;
                return contactForm;
            })
        }
    }

    return doc;
}

const add = async (params: ISettingAddParamService) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertObjectIdInData(params, settingObjectIdKeys);

    return (await settingModel.create(params)).toObject()
}

const updateGeneral = async (params: ISettingUpdateGeneralParamService) => {
    params = Variable.clearAllScriptTags(params, ["head", "script"]);
    params = MongoDBHelpers.convertObjectIdInData(params, settingObjectIdKeys);

    let doc = (await settingModel.findOne({}).exec());

    if(doc){
        doc = Object.assign(doc, params);

        await doc.save();
    }

    return params;
}

const updateSEO = async (params: ISettingUpdateSEOParamService) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertObjectIdInData(params, settingObjectIdKeys);

    let doc = (await settingModel.findOne({}).exec());

    if(doc){
        if (params.seoContents) {
            let docSeoContent = doc.seoContents.findSingle("langId", params.seoContents.langId);
            if (docSeoContent) {
                docSeoContent = Object.assign(docSeoContent, params.seoContents);
            } else {
                doc.seoContents.push(params.seoContents)
            }
            delete params.seoContents;
        }
        doc = Object.assign(doc, params);

        await doc.save();
    }

    return params;
}

const updateContactForm = async (params: ISettingUpdateContactFormParamService) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertObjectIdInData(params, settingObjectIdKeys);

    if (params.contactForms) {
        params.contactForms.map(contactForm => {
            if (Variable.isEmpty(contactForm.password)) {
                delete contactForm.password;
            }
            return contactForm;
        })
    }

    let doc = (await settingModel.findOne({}).exec());

    if(doc){
        doc.contactForms = params.contactForms;
        await doc.save();
    }

    return params;
}

const updateStaticContent = async (params: ISettingUpdateStaticContentParamService) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertObjectIdInData(params, settingObjectIdKeys);

    let doc = (await settingModel.findOne({}).exec());

    if(doc){
        if (params.staticContents) {
            // Check delete
            doc.staticContents = doc.staticContents.filter(staticLanguage =>  params.staticContents && params.staticContents.indexOfKey("_id", staticLanguage._id) > -1)
            // Check Update
            for (let paramStaticContent of params.staticContents) {
                let docStaticContent = doc.staticContents.findSingle("_id", paramStaticContent._id);
                if (docStaticContent) {
                    let docStaticContentContent = docStaticContent.contents.findSingle("langId", paramStaticContent.contents.langId);
                    if (docStaticContentContent) {
                        docStaticContentContent = Object.assign(docStaticContentContent, paramStaticContent.contents);
                    } else {
                        docStaticContent.contents.push(paramStaticContent.contents)
                    }
                    docStaticContent = Object.assign(docStaticContent, {
                        ...paramStaticContent,
                        contents: docStaticContent.contents
                    })
                } else {
                    doc.staticContents.push({
                        ...paramStaticContent,
                        contents: [paramStaticContent.contents]
                    })
                }
            }
            delete params.staticContents;
        }

        doc = Object.assign(doc, params);

        await doc.save();
    }

    return params;
}

const updateSocialMedia = async (params: ISettingUpdateSocialMediaParamService) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertObjectIdInData(params, settingObjectIdKeys);

    let doc = (await settingModel.findOne({}).exec());

    if(doc){
        doc.socialMedia = params.socialMedia;
        await doc.save();
    }

    return params;
}

const updateECommerce = async (params: ISettingUpdateECommerceParamService) => {
    params = Variable.clearAllScriptTags(params);
    params = MongoDBHelpers.convertObjectIdInData(params, settingObjectIdKeys);

    let doc = (await settingModel.findOne({}).exec());

    if(doc){
        doc = Object.assign(doc, params);
        await doc.save();
    }

    return params;
}

export const SettingService = {
    get: get,
    add: add,
    updateGeneral: updateGeneral,
    updateSEO: updateSEO,
    updateContactForm: updateContactForm,
    updateStaticContent: updateStaticContent,
    updateSocialMedia: updateSocialMedia,
    updateECommerce: updateECommerce,
};