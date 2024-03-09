import { ObjectId } from "mongoose"
import {ElementTypeId} from "../../constants/elementTypes";

export interface IComponentModel {
    _id?: ObjectId | string,
    authorId: ObjectId | string
    lastAuthorId: ObjectId | string
    title: string,
    elementId: string
    elements: IComponentElementModel[]
}

export interface IComponentElementModel {
    _id?: ObjectId | string,
    elementId: string
    typeId: ElementTypeId,
    title: string,
    rank: number,
    contents: IComponentElementContentModel[]
}

export interface IComponentElementContentModel {
    _id?: ObjectId | string,
    langId: ObjectId | string
    content?: string
    url?: string
}