import * as mongoose from 'mongoose';
import { userModel } from '@models/user.model';
import { StatusId } from '@constants/status';
import { languageModel } from '@models/language.model';
import {
  INavigationContentModel,
  INavigationModel,
} from 'types/models/navigation.model';

const schemaContent = new mongoose.Schema<INavigationContentModel>({
  langId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: languageModel,
    required: true,
  },
  title: { type: String, default: '' },
  url: { type: String, default: '' },
}, {timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true }});

const schema = new mongoose.Schema<INavigationModel>(
  {
    statusId: { type: Number, required: true, enum: StatusId },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'navigations' },
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
    isPrimary: { type: Boolean, default: true },
    isSecondary: { type: Boolean, default: false },
    contents: { type: [schemaContent], default: [] },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
).index({ statusId: 1, authorId: 1 });

schema.virtual('parent', {
  ref: 'navigations',
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

schemaContent.virtual('lang', {
  ref: 'languages',
  localField: 'langId',
  foreignField: '_id',
  options: { omitUndefined: true },
  justOne: true,
});

export const navigationModel = mongoose.model<
  INavigationModel,
  mongoose.Model<INavigationModel>
>('navigations', schema);
