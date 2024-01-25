import { ObjectId } from "mongoose"
import {GalleryTypeId} from "../../constants/galleryTypeId";

export interface GalleryDocument {
    _id?: string | ObjectId
    name: string
    oldName: string
    typeId: GalleryTypeId
    authorId: string | ObjectId
    createdAt?: string
    updatedAt?: string
}