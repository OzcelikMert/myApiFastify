import {IUserPopulateService} from "types/services/user.service";
import {PostTypeId} from "@constants/postTypes";
import {StatusId} from "@constants/status";
import {IPostCommentModel} from "types/models/postComment.model";

export type IPostCommentGetDetailedResultService = {
    authorId: IUserPopulateService,
    lastAuthorId: IUserPopulateService,
    likeNumber: number
    likes?: string[]
    didLike?: boolean
} & Omit<IPostCommentModel, "authorId"|"lastAuthorId"|"likes">

export interface IPostCommentGetParamService {
    _id?: string,
    postId?: string
    postTypeId: PostTypeId
    statusId?: StatusId
    authorId?: string
}

export interface IPostCommentGetManyParamService {
    _id?: string[],
    postId?: string
    postTypeId: PostTypeId
    statusId?: StatusId
    authorId?: string
}

export interface IPostCommentGetDetailedParamService {
    _id?: string,
    postId?: string
    postTypeId: PostTypeId
    statusId?: StatusId
    authorId?: string
    authorIdDidLike?: string
}

export interface IPostCommentGetDetailedManyParamService {
    _id?: string[],
    postId?: string
    postTypeId: PostTypeId
    statusId?: StatusId
    authorId?: string
    authorIdDidLike?: string
}

export type IPostCommentAddParamService = {

} & Omit<IPostCommentModel, "likes">

export type IPostCommentUpdateParamService = {
    _id: string,
} & Omit<IPostCommentAddParamService, "authorId"|"lastAuthorId">

export type IPostCommentUpdateLikeParamService = {
    _id: string,
    authorId: string
    postTypeId: PostTypeId,
    postId: string
}

export type IPostCommentUpdateStatusManyParamService = {
    _id: string[],
    postTypeId: PostTypeId,
    statusId: StatusId,
    lastAuthorId: string
    postId: string
}

export interface IPostCommentDeleteManyParamService {
    _id: string[]
    postTypeId: PostTypeId
    postId: string
}