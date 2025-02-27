import * as mongoose from 'mongoose';
import { languageModel } from '@models/language.model';
import {
  ISettingContactModel,
  ISettingContactFormModel,
  ISettingModel,
  ISettingSeoContentModel,
  ISettingSocialMediaModel,
  ISettingECommerceModel,
  ISettingPathModel,
  ISettingPathContentModel,
} from 'types/models/setting.model';
import { CurrencyId } from '@constants/currencyTypes';

const schemaPathContent = new mongoose.Schema<ISettingPathContentModel>(
  {
    langId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: languageModel,
      required: true,
    },
    asPath: { type: String, default: '' },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

const schemaPath = new mongoose.Schema<ISettingPathModel>(
  {
    title: { type: String, required: true },
    key: { type: String, required: true },
    path: { type: String, required: true },
    contents: { type: [schemaPathContent], default: [] },
  },
  { timestamps: true }
);

const schemaContactForm = new mongoose.Schema<ISettingContactFormModel>({
  title: { type: String, default: '' },
  name: { type: String, default: '' },
  targetEmail: { type: String, default: '' },
  email: { type: String, default: '' },
  key: { type: String, default: '' },
  password: { type: String, default: '' },
  host: { type: String, default: '' },
  port: { type: Number, default: 465 },
  hasSSL: { type: Boolean, default: false },
});

const schemaSocialMedia = new mongoose.Schema<ISettingSocialMediaModel>({
  key: { type: String },
  title: { type: String },
  url: { type: String },
});

const schemaECommerce = new mongoose.Schema<ISettingECommerceModel>({
  currencyId: {
    type: Number,
    enum: CurrencyId,
    default: CurrencyId.TurkishLira,
  },
});

const schemaContact = new mongoose.Schema<ISettingContactModel>({
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  addressMap: { type: String },
});

const schemaSEOContent = new mongoose.Schema<ISettingSeoContentModel>(
  {
    langId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: languageModel,
      required: true,
    },
    title: { type: String, default: '' },
    content: { type: String, default: '' },
    tags: { type: [String], default: [] },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

const schema = new mongoose.Schema<ISettingModel>(
  {
    icon: { type: String, default: '' },
    logo: { type: String, default: '' },
    logoTwo: { type: String, default: '' },
    head: { type: String, default: '' },
    script: { type: String, default: '' },
    googleAnalyticURL: { type: String, default: 'javascript:void(0);' },
    seoContents: { type: [schemaSEOContent], default: [] },
    contact: { type: schemaContact },
    contactForms: { type: [schemaContactForm], default: [] },
    socialMedia: { type: [schemaSocialMedia], default: [] },
    eCommerce: { type: schemaECommerce },
    paths: { type: [schemaPath], default: [] },
  },
  { timestamps: true }
);

schemaSEOContent.virtual('lang', {
  ref: 'languages',
  localField: 'langId',
  foreignField: '_id',
  options: { omitUndefined: true },
  justOne: true,
});

schemaPathContent.virtual('lang', {
  ref: 'languages',
  localField: 'langId',
  foreignField: '_id',
  options: { omitUndefined: true },
  justOne: true,
});

export const settingModel = mongoose.model<
  ISettingModel,
  mongoose.Model<ISettingModel>
>('settings', schema);
