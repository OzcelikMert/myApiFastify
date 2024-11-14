import { ObjectId } from 'mongoose';
import { ElementTypeId } from '@constants/elementTypes';
import { ComponentTypeId } from '@constants/componentTypes';

export interface IComponentModel {
  _id?: ObjectId | string;
  authorId: ObjectId | string;
  lastAuthorId: ObjectId | string;
  typeId: ComponentTypeId;
  title: string;
  key: string;
  elements: IComponentElementModel[];
}

export interface IComponentElementModel {
  _id?: ObjectId | string;
  key: string;
  typeId: ElementTypeId;
  title: string;
  rank: number;
  contents: IComponentElementContentModel[];
}

export interface IComponentElementContentModel {
  _id?: ObjectId | string;
  langId: ObjectId | string;
  content?: string;
  url?: string;
}
