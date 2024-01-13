import { ObjectId } from "mongoose"

export interface GalleryDocument {
    _id?: string | ObjectId
    name: string
    oldName: string
    title: string
    authorId: string | ObjectId
}