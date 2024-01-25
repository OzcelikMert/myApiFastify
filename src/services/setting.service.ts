import * as mongoose from "mongoose";
import settingModel from "../models/setting.model";
import {
    SettingAddParamDocument,
    SettingGetParamDocument,
    SettingGetResultDocument,
    SettingUpdateStaticLanguageParamDocument,
    SettingUpdateSocialMediaParamDocument,
    SettingUpdateSEOParamDocument,
    SettingUpdateContactFormParamDocument,
    SettingUpdateECommerceParamDocument,
    SettingUpdateGeneralParamDocument
} from "../types/services/setting.service";
import MongoDBHelpers from "../library/mongodb/helpers";
import Variable from "../library/variable";
import {Config} from "../config";
import settingObjectIdKeys from "../constants/objectIdKeys/setting.objectIdKeys";
import {SettingDocument} from "../types/models/setting.model";

export default {
    async get(params: SettingGetParamDocument, withPassword: boolean = false) {
        let filters: mongoose.FilterQuery<SettingDocument> = {}
        let projection: mongoose.ProjectionType<SettingDocument> = {};

        params = MongoDBHelpers.convertObjectIdInData(params, settingObjectIdKeys);
        let defaultLangId = MongoDBHelpers.createObjectId(Config.defaultLangId);

        if(params.projection){
            switch (params.projection) {
                case "general": projection = {eCommerce: 0, staticLanguages: 0, socialMedia: 0, contactForms: 0, seoContents: 0}; break;
                case "seo": projection = {seoContents: 1}; break;
                case "contactForm": projection = {contactForms: 1}; break;
                case "eCommerce": projection = {eCommerce: 1}; break;
                case "staticLanguage": projection = {staticLanguages: 1}; break;
                case "socialMedia": projection = {socialMedia: 1}; break;
                default: projection = {contactForms: 0}; break;
            }
        }

        let query = settingModel.findOne(filters, projection);

        let doc = (await query.lean<SettingGetResultDocument>().exec());

        if(doc){
            if (Array.isArray(doc.seoContents)) {
                doc.seoContents = doc.seoContents.findSingle("langId", params.langId) ?? doc.seoContents.findSingle("langId", defaultLangId);
            }

            if (Array.isArray(doc.staticLanguages)) {
                doc.staticLanguages = doc.staticLanguages.map(staticLang => {
                    if(Array.isArray(staticLang.contents)){
                        staticLang.contents = staticLang.contents.findSingle("langId", params.langId) ?? staticLang.contents.findSingle("langId", defaultLangId);
                    }
                    return staticLang;
                })
            }

            if (!withPassword) {
                doc.contactForms?.map(contactForm => {
                    delete contactForm.password;
                    return contactForm;
                })
            }
        }

        return doc;
    },
    async add(params: SettingAddParamDocument) {
        params = Variable.clearAllScriptTags(params);
        params = MongoDBHelpers.convertObjectIdInData(params, settingObjectIdKeys);

        return await settingModel.create(params)
    },
    async updateGeneral(params: SettingUpdateGeneralParamDocument) {
        params = Variable.clearAllScriptTags(params, ["head", "script"]);
        params = MongoDBHelpers.convertObjectIdInData(params, settingObjectIdKeys);

        if (params.defaultLangId) {
            Config.defaultLangId = params.defaultLangId.toString();
        }

        let doc = (await settingModel.findOne({}).exec());

        if(doc){
            doc = Object.assign(doc, params);

            await doc.save();
        }

        return params;
    },
    async updateSEO(params: SettingUpdateSEOParamDocument) {
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
    },
    async updateContactForm(params: SettingUpdateContactFormParamDocument) {
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
    },
    async updateStaticLanguage(params: SettingUpdateStaticLanguageParamDocument) {
        params = Variable.clearAllScriptTags(params);
        params = MongoDBHelpers.convertObjectIdInData(params, settingObjectIdKeys);

        let doc = (await settingModel.findOne({}).exec());

        if(doc){
            if (params.staticLanguages) {
                // Check delete
                doc.staticLanguages = doc.staticLanguages.filter(staticLanguage =>  params.staticLanguages && params.staticLanguages.indexOfKey("_id", staticLanguage._id) > -1)
                // Check Update
                for (let paramStaticLanguage of params.staticLanguages) {
                    let docStaticLanguage = doc.staticLanguages.findSingle("_id", paramStaticLanguage._id);
                    if (docStaticLanguage) {
                        let docStaticLanguageContent = docStaticLanguage.contents.findSingle("langId", paramStaticLanguage.contents.langId);
                        if (docStaticLanguageContent) {
                            docStaticLanguageContent = Object.assign(docStaticLanguageContent, paramStaticLanguage.contents);
                        } else {
                            docStaticLanguage.contents.push(paramStaticLanguage.contents)
                        }
                        docStaticLanguage = Object.assign(docStaticLanguage, {
                            ...paramStaticLanguage,
                            contents: docStaticLanguage.contents
                        })
                    } else {
                        doc.staticLanguages.push({
                            ...paramStaticLanguage,
                            contents: [paramStaticLanguage.contents]
                        })
                    }
                }
                delete params.staticLanguages;
            }

            doc = Object.assign(doc, params);

            await doc.save();
        }

        return params;
    },
    async updateSocialMedia(params: SettingUpdateSocialMediaParamDocument) {
        params = Variable.clearAllScriptTags(params);
        params = MongoDBHelpers.convertObjectIdInData(params, settingObjectIdKeys);

        let doc = (await settingModel.findOne({}).exec());

        if(doc){
            doc.socialMedia = params.socialMedia;
            await doc.save();
        }

        return params;
    },
    async updateECommerce(params: SettingUpdateECommerceParamDocument) {
        params = Variable.clearAllScriptTags(params);
        params = MongoDBHelpers.convertObjectIdInData(params, settingObjectIdKeys);

        let doc = (await settingModel.findOne({}).exec());

        if(doc){
            doc = Object.assign(doc, params);
            await doc.save();
        }

        return params;
    },
};