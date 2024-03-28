import * as mongoose from "mongoose";
import {languageModel} from "./language.model";
import {
    ISettingContactModel,
    ISettingContactFormModel,
    ISettingModel,
    ISettingSeoContentModel,
    ISettingStaticContentModel,
    ISettingStaticContentContentModel, ISettingSocialMediaModel, ISettingECommerceModel
} from "../types/models/setting.model";
import {CurrencyId} from "../constants/currencyTypes";
import {StaticContentTypeId} from "../constants/staticContentTypes";

const schemaStaticContentContent = new mongoose.Schema<ISettingStaticContentContentModel>(
    {
        langId: {type: mongoose.Schema.Types.ObjectId, ref: languageModel, required: true},
        content: {type: String, default: ""},
        url: {type: String}
    }
).index({langId: 1});

const schemaStaticContent = new mongoose.Schema<ISettingStaticContentModel>(
    {
        typeId: {type: Number, required: true, enum: StaticContentTypeId},
        label: {type: String, required: true},
        key: {type: String, required: true},
        rank: {type: Number, default: 0},
        contents: {type: [schemaStaticContentContent], default: []}
    }
);

const schemaContactForm = new mongoose.Schema<ISettingContactFormModel>(
    {
        name: {type: String, default: ""},
        outGoingEmail: {type: String, default: ""},
        email: {type: String, default: ""},
        key: {type: String, default: ""},
        password: {type: String, default: ""},
        inComingServer: {type: String, default: ""},
        outGoingServer: {type: String, default: ""},
        port: {type: Number, default: 465}
    }
);

const schemaSocialMedia = new mongoose.Schema<ISettingSocialMediaModel>(
    {
        key: {type: String},
        title: {type: String},
        url: {type: String},
    }
);

const schemaECommerce = new mongoose.Schema<ISettingECommerceModel>(
    {
        currencyId: {type: Number, enum: CurrencyId, default: CurrencyId.TurkishLira},
    }
);

const schemaContact = new mongoose.Schema<ISettingContactModel>(
    {
        email: {type: String},
        phone: {type: String},
        address: {type: String},
        addressMap: {type: String},
    }
);

const schemaSEOContent = new mongoose.Schema<ISettingSeoContentModel>(
    {
        langId: {type: mongoose.Schema.Types.ObjectId, ref: languageModel, required: true},
        title: {type: String, default: ""},
        content: {type: String, default: ""},
        tags: {type: [String], default: []}
    },
    {timestamps: true}
).index({langId: 1});

const schema = new mongoose.Schema<ISettingModel>(
    {
        icon: {type: String, default: ""},
        logo: {type: String, default: ""},
        logoTwo: {type: String, default: ""},
        head: {type: String, default: ""},
        script: {type: String, default: ""},
        seoContents: {type: [schemaSEOContent], default: []},
        contact: {type: schemaContact},
        contactForms: {type: [schemaContactForm], default: []},
        staticContents: {type: [schemaStaticContent], default: []},
        socialMedia: {type: [schemaSocialMedia], default: []},
        eCommerce: {type: schemaECommerce},
    },
    {timestamps: true}
);

export const settingModel = mongoose.model<ISettingModel, mongoose.Model<ISettingModel>>("settings", schema)