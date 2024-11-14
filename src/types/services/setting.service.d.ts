import {
  ISettingContactFormModel,
  ISettingModel,
  ISettingECommerceModel,
  ISettingSeoContentModel,
  ISettingSocialMediaModel,
  ISettingPathModel,
  ISettingPathContentModel,
} from 'types/models/setting.model';
import { SettingProjectionKeys } from '@constants/settingProjections';

export type ISettingPathGetResultService = {
  contents?: ISettingPathContentModel | ISettingPathContentModel[];
} & Omit<ISettingPathModel, 'contents'>;

export type ISettingGetResultService = {
  seoContents?: ISettingSeoContentModel | ISettingSeoContentModel[];
  paths?: ISettingPathGetResultService | ISettingPathGetResultService[];
} & Omit<ISettingModel, 'seoContents' | 'paths'>;

export type ISettingGetParamService = {
  langId?: string;
  projection?: SettingProjectionKeys;
};

export type ISettingAddParamService = {
  seoContents?: ISettingSeoContentModel;
  contactForms?: ISettingContactFormModel[];
  socialMedia?: ISettingSocialMediaModel[];
  paths?: ISettingPathModel;
} & Omit<
  ISettingModel,
  '_id' | 'seoContents' | 'contactForms' | 'socialMedia' | 'paths'
>;

export type ISettingUpdateGeneralParamService = {} & Omit<
  ISettingAddParamService,
  'seoContents' | 'contactForms' | 'socialMedia'
>;

export type ISettingUpdateSEOParamService = {
  seoContents?: ISettingSeoContentModel;
};

export type ISettingUpdateECommerceParamService = {
  eCommerce: ISettingECommerceModel;
};

export type ISettingUpdateContactFormParamService = {
  contactForms: ISettingContactFormModel[];
};

export type ISettingUpdateSocialMediaParamService = {
  socialMedia: ISettingSocialMediaModel[];
};

export type ISettingUpdatePathParamService = {
  paths: (Omit<ISettingPathModel, 'contents'> & {
    contents: ISettingPathContentModel;
  })[];
};
