import { IUserPopulateService } from 'types/services/db/user.service';
import { IPostTermPopulateService } from 'types/services/db/postTerm.service';
import {
  IPostContentModel,
  IPostModel,
  IPostECommerceModel,
  IPostECommerceVariationModel,
  IPostECommerceAttributeModel,
  IPostECommerceVariationOptionModel,
} from 'types/models/post.model';
import { PostTypeId } from '@constants/postTypes';
import { PageTypeId } from '@constants/pageTypes';
import { StatusId } from '@constants/status';
import { IComponentModel } from 'types/models/component.model';
import { PostSortTypeId } from '@constants/postSortTypes';
import { ILanguageModel } from 'types/models/language.model';

export interface IPostPopulateService {
  _id: string;
  contents?: Partial<IPostContentModel>;
  authorId?: string;
  authors?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IPostAlternateService {
  langId: string;
  title?: string;
  url?: string;
}

export type IPostGetResultServiceECommerceVariation = {
  product?: Omit<IPostModel, 'contents'> & {
    alternates?: IPostAlternateService[];
    contents?: IPostContentModel | IPostContentModel[];
    author?: IUserPopulateService;
    lastAuthor?: IUserPopulateService;
  };
} & IPostECommerceVariationModel;

export type IPostGetResultServiceECommerceAttribute<T = string> = {
  variationTerms: T[];
  attributeTerm?: IPostTermPopulateService;
} & Omit<IPostECommerceAttributeModel, 'variationTerms'>;

export type IPostGetResultServiceECommerce<T = string> = {
  variations: IPostGetResultServiceECommerceVariation[];
  attributes: IPostGetResultServiceECommerceAttribute<T>[];
} & Omit<IPostECommerceModel, 'variations' | 'attributes'>;

export type IPostGetDetailedResultService = {
  author?: IUserPopulateService;
  lastAuthor?: IUserPopulateService;
  authors?: IUserPopulateService[];
  views?: number;
  categories?: IPostTermPopulateService[];
  tags?: IPostTermPopulateService[];
  contents?: IPostContentModel | IPostContentModel[];
  alternates?: IPostAlternateService[];
  eCommerce?: IPostGetResultServiceECommerce<IPostTermPopulateService>;
} & Omit<
  IPostModel,
  'contents' | 'categories' | 'tags' | 'eCommerce' | 'authors'
>;

export type IPostGetManyDetailedResultService = {} & IPostGetDetailedResultService;

export interface IPostGetParamService {
  typeId: PostTypeId;
  _id?: string;
  pageTypeId?: PageTypeId;
  langId?: string;
  url?: string;
  statusId?: StatusId;
  ignorePostId?: string[];
  authorId?: string;
}

export interface IPostGetManyParamService {
  _id?: string[];
  typeId?: PostTypeId[];
  pageTypeId?: PageTypeId[];
  langId?: string;
  statusId?: StatusId;
  ignorePostId?: string[];
  title?: string;
  categories?: string[];
  tags?: string[];
  authorId?: string;
  dateStart?: Date;
}

export interface IPostGetDetailedParamService {
  typeId: PostTypeId;
  _id?: string;
  pageTypeId?: PageTypeId;
  langId?: string;
  url?: string;
  statusId?: StatusId;
  ignorePostId?: string[];
  authorId?: string;
  isIncludePrevAndNext?: boolean;
}

export interface IPostGetManyDetailedParamService {
  _id?: string[];
  sortTypeId?: PostSortTypeId;
  typeId: PostTypeId[];
  pageTypeId?: PageTypeId[];
  langId?: string;
  statusId?: StatusId;
  count?: number;
  page?: number;
  ignorePostId?: string[];
  title?: string;
  categories?: string[];
  tags?: string[];
  authorId?: string;
  dateStart?: Date;
}

export interface IPostGetPrevNextResultService {
  _id: string;
  contents?: IPostContentModel | IPostContentModel[];
  createdAt: string;
}

export interface IPostGetPrevNextParamService {
  typeId: PostTypeId;
  statusId?: StatusId;
  prevId?: string;
  nextId?: string;
  langId?: string;
  categories?: string[];
  tags?: string[];
  authorId?: string;
}

export interface IPostGetCountParamService {
  typeId: PostTypeId;
  statusId?: StatusId;
  title?: string;
  categories?: string[];
  authorId?: string;
}

export type IPostAddParamService = {
  _id?: string;
  contents: IPostContentModel;
  rank?: number;
} & Omit<IPostModel, '_id' | 'views' | 'contents' | 'rank'>;

export type IPostUpdateParamService = {
  _id: string;
  contents?: IPostContentModel;
} & Omit<IPostAddParamService, '_id' | 'authorId' | 'contents'>;

export type IPostUpdateRankParamService = {
  _id: string;
  typeId: PostTypeId;
  rank: number;
  lastAuthorId: string;
};

export type IPostUpdateViewParamService = {
  _id: string;
  typeId: PostTypeId;
  langId?: string;
  url?: string;
};

export type IPostUpdateStatusManyParamService = {
  _id: string[];
  typeId?: PostTypeId;
  statusId: StatusId;
  lastAuthorId?: string;
};

export interface IPostDeleteManyParamService {
  _id?: string[];
  parentId?: string;
  typeId: PostTypeId;
}
