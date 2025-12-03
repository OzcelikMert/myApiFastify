import { IGalleryModel } from 'types/models/gallery.model';
import { IUserPopulateService } from 'types/services/db/user.service';
import { GalleryTypeId } from '@constants/galleryTypeId';

export type IGalleryImageProperties = {
  sizeKB: number;
  sizeMB: number;
};

export type IGalleryGetDetailedResultService = {
  author?: IUserPopulateService;
} & IGalleryModel;

export interface IGalleryGetParamService {
  _id?: string;
  name?: string;
  authorId?: string;
}

export interface IGalleryGetManyParamService {
  _id?: string[];
  name?: string[];
  authorId?: string;
  typeId?: GalleryTypeId;
}

export interface IGalleryGetDetailedParamService {
  _id?: string;
  name?: string;
  authorId?: string;
}

export interface IGalleryGetManyDetailedParamService {
  _id?: string[];
  name?: string[];
  authorId?: string;
  typeId?: GalleryTypeId;
}

export type IGalleryAddParamService = {} & Omit<IGalleryModel, '_id'>;

export interface IGalleryDeleteManyParamService {
  _id: string[];
  authorId?: string;
}
