import * as mongoose from 'mongoose';
import { settingModel } from '@models/setting.model';
import {
  ISettingAddParamService,
  ISettingGetParamService,
  ISettingGetResultService,
  ISettingUpdateContactFormParamService,
  ISettingUpdateECommerceParamService,
  ISettingUpdateGeneralParamService,
  ISettingUpdatePathParamService,
  ISettingUpdateSEOParamService,
  ISettingUpdateSocialMediaParamService,
} from 'types/services/setting.service';
import { MongoDBHelpers } from '@library/mongodb/helpers';
import { VariableLibrary } from '@library/variable';
import { Config } from '@configs/index';
import { settingObjectIdKeys } from '@constants/objectIdKeys/setting.objectIdKeys';
import { ISettingModel } from 'types/models/setting.model';
import { SettingProjectionKeys } from '@constants/settingProjections';

const get = async (
  params: ISettingGetParamService,
  withPasswordContactForm: boolean = false
) => {
  const filters: mongoose.FilterQuery<ISettingModel> = {};
  let projection: mongoose.ProjectionType<ISettingModel> = { contactForms: 0 };

  params = MongoDBHelpers.convertToObjectIdData(params, settingObjectIdKeys);
  const defaultLangId = MongoDBHelpers.convertToObjectId(Config.defaultLangId);

  if (params.projection) {
    switch (params.projection) {
      case SettingProjectionKeys.General:
        projection = {
          eCommerce: 0,
          socialMedia: 0,
          contactForms: 0,
          seoContents: 0,
        };
        break;
      case SettingProjectionKeys.SEO:
        projection = { seoContents: 1 };
        break;
      case SettingProjectionKeys.ContactForm:
        projection = { contactForms: 1 };
        break;
      case SettingProjectionKeys.ECommerce:
        projection = { eCommerce: 1 };
        break;
      case SettingProjectionKeys.SocialMedia:
        projection = { socialMedia: 1 };
        break;
      case SettingProjectionKeys.Path:
        projection = { paths: 1 };
        break;
    }
  }

  const query = settingModel.findOne(filters, projection);

  if (params.projection) {
    switch (params.projection) {
      case SettingProjectionKeys.SEO:
        query.populate("seoContents.lang")
        break;
      case SettingProjectionKeys.Path:
        query.populate("paths.contents.lang")
        break;
    }
  }

  const doc = await query.lean<ISettingGetResultService>().exec();

  if (doc) {
    if (Array.isArray(doc.seoContents)) {
      doc.seoContentAlternates = doc.seoContents.map((content) => ({
        langId: content.langId.toString(),
      }));

      doc.seoContents =
        doc.seoContents.findSingle('langId', params.langId) ??
        doc.seoContents.findSingle('langId', defaultLangId);
    }

    if (Array.isArray(doc.paths)) {
      doc.paths = doc.paths.map((path) => {
        if (Array.isArray(path.contents)) {
          path.contents =
            path.contents.findSingle('langId', params.langId) ??
            path.contents.findSingle('langId', defaultLangId);
        }
        return path;
      });
    }

    if (!withPasswordContactForm && doc.contactForms) {
      doc.contactForms.map((contactForm) => {
        delete contactForm.password;
        return contactForm;
      });
    }
  }

  return doc;
};

const add = async (params: ISettingAddParamService) => {
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(params, settingObjectIdKeys);

  return (await settingModel.create(params)).toObject();
};

const updateGeneral = async (params: ISettingUpdateGeneralParamService) => {
  params = MongoDBHelpers.convertToObjectIdData(params, settingObjectIdKeys);

  let doc = await settingModel.findOne({}).exec();

  if (doc) {
    doc = Object.assign(doc, params);

    await doc.save();
  }

  return params;
};

const updateSEO = async (params: ISettingUpdateSEOParamService) => {
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(params, settingObjectIdKeys);

  let doc = await settingModel.findOne({}).exec();

  if (doc) {
    if (params.seoContents) {
      let docSeoContent = doc.seoContents.findSingle(
        'langId',
        params.seoContents.langId
      );
      if (docSeoContent) {
        docSeoContent = Object.assign(docSeoContent, params.seoContents);
      } else {
        doc.seoContents.push(params.seoContents);
      }
      delete params.seoContents;
    }
    doc = Object.assign(doc, params);

    await doc.save();
  }

  return params;
};

const updateContactForm = async (
  params: ISettingUpdateContactFormParamService
) => {
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(params, settingObjectIdKeys);

  params.contactForms.map((contactForm) => {
    if (VariableLibrary.isEmpty(contactForm.password)) {
      delete contactForm.password;
    }
    return contactForm;
  });

  const doc = await settingModel.findOne({}).exec();

  if (doc) {
    for (const paramContactForm of params.contactForms) {
      let docContactForm = doc.contactForms.findSingle(
        '_id',
        MongoDBHelpers.convertToObjectId(paramContactForm._id)
      );
      if (docContactForm) {
        docContactForm = Object.assign(docContactForm, paramContactForm);
      }
    }
    await doc.save();
  }

  return params;
};

const updateSocialMedia = async (
  params: ISettingUpdateSocialMediaParamService
) => {
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(params, settingObjectIdKeys);

  const doc = await settingModel.findOne({}).exec();

  if (doc) {
    doc.socialMedia = params.socialMedia;
    await doc.save();
  }

  return params;
};

const updateECommerce = async (params: ISettingUpdateECommerceParamService) => {
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(params, settingObjectIdKeys);

  let doc = await settingModel.findOne({}).exec();

  if (doc) {
    doc = Object.assign(doc, params);
    await doc.save();
  }

  return params;
};

const updatePath = async (params: ISettingUpdatePathParamService) => {
  params = VariableLibrary.clearAllScriptTags(params);
  params = MongoDBHelpers.convertToObjectIdData(params, settingObjectIdKeys);

  const doc = await settingModel.findOne({}).exec();

  if (doc) {
    if (params.paths) {
      // Check delete
      doc.paths = doc.paths.filter(
        (path) => params.paths.indexOfKey('_id', path._id) > -1
      );
      // Check Update
      for (const paramPath of params.paths) {
        let docPath = doc.paths.findSingle('_id', paramPath._id);
        if (docPath) {
          let docPathContent = docPath.contents.findSingle(
            'langId',
            paramPath.contents.langId
          );
          if (docPathContent) {
            docPathContent = Object.assign(docPathContent, paramPath.contents);
          } else {
            docPath.contents.push(paramPath.contents);
          }
          docPath = Object.assign(docPath, {
            ...paramPath,
            contents: docPath.contents,
          });
        } else {
          doc.paths.push({
            ...paramPath,
            contents: [paramPath.contents],
          });
        }
      }
    }

    await doc.save();
  }

  return params;
};

export const SettingService = {
  get: get,
  add: add,
  updateGeneral: updateGeneral,
  updateSEO: updateSEO,
  updateContactForm: updateContactForm,
  updateSocialMedia: updateSocialMedia,
  updateECommerce: updateECommerce,
  updatePath: updatePath,
};
