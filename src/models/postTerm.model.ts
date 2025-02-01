import * as mongoose from 'mongoose';
import { StatusId } from '@constants/status';
import { PostTypeId } from '@constants/postTypes';
import { PostTermTypeId } from '@constants/postTermTypes';
import { userModel } from '@models/user.model';
import { languageModel } from '@models/language.model';
import {
  IPostTermContentModel,
  IPostTermModel,
} from 'types/models/postTerm.model';

const schemaContent = new mongoose.Schema<IPostTermContentModel>(
  {
    langId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: languageModel,
      required: true,
    },
    image: { type: String, default: '' },
    title: { type: String, default: '' },
    shortContent: { type: String, default: '' },
    url: { type: String, default: '' },
    views: { type: Number, default: 0 },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

const schema = new mongoose.Schema<IPostTermModel>(
  {
    typeId: { type: Number, required: true, enum: PostTermTypeId },
    postTypeId: { type: Number, required: true, enum: PostTypeId },
    statusId: { type: Number, required: true, enum: StatusId },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'postTerms' },
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
    rank: { type: Number, default: 0 },
    contents: { type: [schemaContent], default: [] },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
).index({ typeId: 1, postTypeId: 1, statusId: 1, authorId: 1 });

schema.virtual('parent', {
  ref: 'postTerms',
  localField: 'parentId',
  foreignField: '_id',
  options: { omitUndefined: true },
  match: {
    statusId: StatusId.Active
  },
  justOne: true,
});

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

schema.virtual('postCount', {
  ref: 'posts',
  localField: '_id',
  foreignField: 'categories',
  options: { omitUndefined: true },
  match: schemaFields => ({
    typeId: schemaFields.postTypeId
  }),
  count: true,
});

export const postTermModel = mongoose.model<
  IPostTermModel,
  mongoose.Model<IPostTermModel>
>('postTerms', schema);
