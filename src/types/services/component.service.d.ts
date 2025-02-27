import { IUserPopulateService } from 'types/services/user.service';
import {
  IComponentElementModel,
  IComponentModel,
  IComponentElementContentModel,
} from 'types/models/component.model';
import { ComponentTypeId } from '@constants/componentTypes';

export interface IComponentAlternateService {
  langId: string;
}

export type IComponentGetDetailedResultServiceElement = {
  contents?: IComponentElementContentModel | IComponentElementContentModel[];
  alternates?: IComponentAlternateService[];
} & Omit<IComponentElementModel, 'contents'>

export type IComponentGetDetailedResultService = {
  author?: IUserPopulateService;
  lastAuthor?: IUserPopulateService;
  elements: IComponentGetDetailedResultServiceElement[];
} & Omit<IComponentModel, 'elements'>;

export interface IComponentGetParamService {
  _id?: string;
  key?: string;
  langId?: string;
}

export interface IComponentGetManyParamService {
  _id?: string[];
  key?: string[];
  langId?: string;
  typeId?: ComponentTypeId;
}

export interface IComponentGetDetailedParamService {
  _id?: string;
  key?: string;
  langId?: string;
}

export interface IComponentGetManyDetailedParamService {
  _id?: string[];
  key?: string[];
  langId?: string;
  typeId?: ComponentTypeId;
  withContent?: boolean;
  withCustomSort?: boolean;
}

export type IComponentAddParamService = {
  elements?: (Omit<IComponentElementModel, 'contents'> & {
    contents: IComponentElementContentModel;
  })[];
} & Omit<IComponentModel, '_id' | 'elements'>;

export type IComponentUpdateParamService = {
  _id: string;
} & Omit<IComponentAddParamService, 'authorId'>;

export interface IComponentDeleteManyParamService {
  _id: string[];
}
