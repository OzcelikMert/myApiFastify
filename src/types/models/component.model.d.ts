import { ObjectId } from "mongoose"
import {ComponentInputTypeId} from "../../constants/componentInputTypes";

export interface ComponentDocument {
    _id?: string | ObjectId,
    authorId: string | ObjectId
    lastAuthorId: string | ObjectId
    elementId: string
    langKey: string,
    types: ComponentTypeDocument[]
}

export interface ComponentTypeDocument {
    _id?: string | ObjectId,
    elementId: string
    typeId: ComponentInputTypeId,
    langKey: string,
    rank: number,
    contents: ComponentTypeContentDocument[]
}

export interface ComponentTypeContentDocument {
    _id?: string | ObjectId,
    langId: string | ObjectId
    content?: string
    url?: string
    comment?: string
}