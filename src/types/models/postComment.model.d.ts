import { ObjectId } from 'mongoose';
import { StatusId } from '@constants/status';
import { PostTypeId } from '@constants/postTypes';

export interface IPostCommentModel {
  _id?: string | ObjectId;
  parentId?: string | ObjectId;
  authorId: string | ObjectId;
  lastAuthorId: string | ObjectId;
  postId: string | ObjectId;
  postTypeId: PostTypeId;
  message: string;
  likes: string[] | ObjectId[];
  statusId: StatusId;
}
