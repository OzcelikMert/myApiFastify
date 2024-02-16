import {IGalleryModel} from "../models/gallery.model";
import {IUserPopulateService} from "./user.service";
import {GalleryTypeId} from "../../constants/galleryTypeId";

export type IGalleryGetResultService = {
    authorId: IUserPopulateService
} & Omit<IGalleryModel, "authorId">

export interface IGalleryGetOneParamService {
    _id?: string
    name?: string
    authorId?: string
}

export interface IGalleryGetManyParamService {
    _id?: string[]
    name?: string[]
    authorId?: string
    typeId?: GalleryTypeId
}

export type IGalleryAddParamService = {} & Omit<IGalleryModel, "_id">

export interface IGalleryDeleteManyParamService {
    _id: string[]
    authorId?: string
}