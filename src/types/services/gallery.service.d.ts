import {GalleryDocument} from "../models/gallery.model";
import {UserPopulateDocument} from "./user.service";
import {GalleryTypeId} from "../../constants/galleryTypeId";

export type GalleryGetResultDocument = {
    authorId: UserPopulateDocument
} & GalleryDocument

export interface GalleryGetOneParamDocument {
    _id?: string
    name?: string
    authorId?: string
}

export interface GalleryGetManyParamDocument {
    _id?: string[]
    name?: string[]
    authorId?: string
    typeId?: GalleryTypeId
}

export type GalleryAddParamDocument = {} & Omit<GalleryDocument, "_id">

export interface GalleryDeleteManyParamDocument {
    _id: string[]
    authorId?: string
}