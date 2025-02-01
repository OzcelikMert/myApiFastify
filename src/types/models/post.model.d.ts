import { ObjectId } from 'mongoose';
import { PostTypeId } from '@constants/postTypes';
import { PageTypeId } from '@constants/pageTypes';
import { StatusId } from '@constants/status';
import { AttributeTypeId } from '@constants/attributeTypes';
import { ProductTypeId } from '@constants/productTypes';

export interface IPostModel {
  _id: string | ObjectId;
  parentId?: string | ObjectId;
  typeId: PostTypeId;
  statusId: StatusId;
  pageTypeId?: PageTypeId;
  authorId: string | ObjectId;
  lastAuthorId: string | ObjectId;
  authors?: string[] | ObjectId[];
  dateStart?: Date | string;
  rank: number;
  isFixed?: boolean;
  categories?: string[] | ObjectId[];
  components?: string[] | ObjectId[];
  tags?: string[] | ObjectId[];
  contents: IPostContentModel[];
  beforeAndAfter?: IPostBeforeAndAfterModel;
  eCommerce?: IPostECommerceModel;
  similarItems?: string[] | ObjectId[];
  isNoIndex?: boolean;
  updatedAt?: string;
  createdAt?: string;
}

export interface IPostContentModel {
  _id?: string | ObjectId;
  langId: string | ObjectId;
  image?: string;
  icon?: string;
  title?: string;
  content?: string;
  shortContent?: string;
  url?: string;
  views?: number;
  buttons?: IPostContentButtonModel[];
}

export interface IPostBeforeAndAfterModel {
  imageBefore: string;
  imageAfter: string;
  images: string[];
}

export interface IPostContentButtonModel {
  _id?: string | ObjectId;
  title: string;
  url?: string;
}

export interface IPostECommerceModel {
  typeId: ProductTypeId;
  images: string[];
  pricing?: IPostECommercePricingModel;
  inventory?: IPostECommerceInventoryModel;
  shipping?: IPostECommerceShippingModel;
  attributes?: IPostECommerceAttributeModel[];
  variations?: IPostECommerceVariationModel[];
  defaultVariationOptions?: IPostECommerceVariationOptionModel[];
}

export interface IPostECommercePricingModel {
  taxRate: number;
  taxExcluded: number;
  taxIncluded: number;
  compared: number;
  shipping: number;
}

export interface IPostECommerceInventoryModel {
  sku: string;
  isManageStock: boolean;
  quantity: number;
}

export interface IPostECommerceShippingModel {
  width: string;
  height: string;
  depth: string;
  weight: string;
}

export interface IPostECommerceAttributeModel {
  _id?: string | ObjectId;
  attributeTermId: string | ObjectId;
  variationTerms: string[] | ObjectId[];
  typeId: AttributeTypeId;
}

export interface IPostECommerceVariationModel {
  _id?: string | ObjectId;
  rank: number;
  options: IPostECommerceVariationOptionModel[];
  productId: string | ObjectId;
}

export interface IPostECommerceVariationOptionModel {
  _id?: string | ObjectId;
  attributeId: string | ObjectId;
  variationTermId: string | ObjectId;
}
