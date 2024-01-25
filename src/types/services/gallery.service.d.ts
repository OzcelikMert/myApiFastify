import {GalleryDocument} from "../models/gallery.model";
import {UserPopulateDocument} from "./user.service";

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
}

export type GalleryAddParamDocument = {} & Omit<GalleryDocument, "_id">

export interface GalleryDeleteManyParamDocument {
    name: string[]
    authorId?: string
}