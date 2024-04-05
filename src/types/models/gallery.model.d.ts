import { ObjectId } from "mongoose"
import {GalleryTypeId} from "@constants/galleryTypeId";

export interface IGalleryModel {
    _id?: string | ObjectId
    name: string
    oldName: string
    typeId: GalleryTypeId
    authorId: string | ObjectId
    sizeKB: number
    sizeMB: number
    createdAt?: string
    updatedAt?: string
}