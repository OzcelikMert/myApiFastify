import { ILanguageModel } from 'types/models/language.model';
import { StatusId } from '@constants/status';

export type ILanguageGetResultService = {
  author?: IUserPopulateService;
  lastAuthor?: IUserPopulateService;
} & ILanguageModel

export interface ILanguageGetParamService {
  _id?: string;
  shortKey?: string;
  locale?: string;
  isDefault?: boolean;
}

export interface ILanguageGetManyParamService {
  _id?: string[];
  shortKey?: string;
  locale?: string;
  statusId?: StatusId;
}

export type ILanguageAddParamService = {} & Omit<ILanguageModel, '_id'>;

export type ILanguageUpdateParamService = {
  _id: string;
} & Omit<ILanguageAddParamService, "authorId">;

export type ILanguageUpdateRankParamService = {
  _id: string;
  rank: number;
};

export type ILanguageUpdateIsDefaultManyParamService = {
  _id?: string[];
  isDefault: boolean;
};
