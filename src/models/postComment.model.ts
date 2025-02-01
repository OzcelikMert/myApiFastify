import * as mongoose from 'mongoose';
import { userModel } from '@models/user.model';
import { IPostCommentModel } from 'types/models/postComment.model';
import { postModel } from '@models/post.model';
import { PostTypeId } from '@constants/postTypes';
import { StatusId } from '@constants/status';

const schema = new mongoose.Schema<IPostCommentModel>(
  {
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'postComments' },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: postModel,
      required: true,
    },
    postTypeId: { type: Number, required: true, enum: PostTypeId },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: userModel,
      required: true,
    },
    lastAuthorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: userModel,
      required: true,
    },
    statusId: { type: Number, required: true, enum: StatusId },
    message: { type: String, default: '' },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: userModel,
      default: [],
    },
    likeCount: { type: Number, required: true, default: 0 },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
).index({ postId: 1, postTypeId: 1, statusId: 1, authorId: 1 });

schema.virtual('author', {
  ref: 'users',
  localField: 'authorId',
  foreignField: '_id',
  options: { omitUndefined: true },
  justOne: true,
});

schema.virtual('lastAuthor', {
  ref: 'users',
  localField: 'lastAuthorId',
  foreignField: '_id',
  options: { omitUndefined: true },
  justOne: true,
});

export const postCommentModel = mongoose.model<
  IPostCommentModel,
  mongoose.Model<IPostCommentModel>
>('postComments', schema);
