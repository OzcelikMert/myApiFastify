import { ObjectId } from "mongoose"
import {StaticContentTypeId} from "../../constants/staticContentTypes";

export interface IComponentModel {
    _id?: string | ObjectId,
    authorId: string | ObjectId
    lastAuthorId: string | ObjectId
    elementId: string
    langKey: string,
    types: IComponentTypeModel[]
}

export interface IComponentTypeModel {
    _id?: string | ObjectId,
    elementId: string
    typeId: StaticContentTypeId,
    langKey: string,
    rank: number,
    contents: IComponentTypeContentModel[]
}

export interface IComponentTypeContentModel {
    _id?: string | ObjectId,
    langId: string | ObjectId
    content?: string
    url?: string
    comment?: string
}