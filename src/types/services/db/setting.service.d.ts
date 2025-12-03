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
import { ILanguageModel } from 'types/models/language.model';

export interface ISettingSeoContentAlternateService {
  langId: string;
}

export type ISettingGetResultService = {
  seoContents?: ISettingSeoContentModel | ISettingSeoContentModel[];
  paths?: ISettingPathGetResultService | ISettingPathGetResultService[];
  seoContentAlternates?: ISettingSeoContentAlternateService[]
} & Omit<ISettingModel, 'seoContents' | 'paths'>;

export type ISettingPathGetResultService = {
  contents?: ISettingPathContentModel | ISettingPathContentModel[];
} & Omit<ISettingPathModel, 'contents'>;

export type ISettingGetParamService = {
  langId?: string;
  projection?: SettingProjectionKeys;
};

export type ISettingAddParamService = {
} & Omit<
  ISettingModel,
  '_id' | 'seoContents' | 'contactForms' | 'socialMedia' | 'paths'
>;

export type ISettingUpdateGeneralParamService = {} & Omit<
  ISettingAddParamService,
  'seoContents' | 'contactForms' | 'socialMedia' | "paths"
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
