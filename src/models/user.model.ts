import * as mongoose from 'mongoose';
import { StatusId } from '@constants/status';
import { UserRoleId } from '@constants/userRoles';
import { IUserModel } from 'types/models/user.model';
import { PermissionId } from '@constants/permissions';

const schema = new mongoose.Schema<IUserModel>(
  {
    roleId: { type: Number, required: true, enum: UserRoleId },
    statusId: { type: Number, required: true, enum: StatusId },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    lastAuthorId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    image: { type: String, default: '' },
    username: { type: String, required: true },
    name: { type: String, default: '' },
    url: { type: String, default: '' },
    comment: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, required: true },
    password: { type: String, required: true },
    permissions: { type: [Number], default: [], enum: PermissionId },
    banDateEnd: { type: Date, default: new Date() },
    banComment: { type: String, default: '' },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
).index({ roleId: 1, statusId: 1, permissions: 1 });

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

export const userModel = mongoose.model<IUserModel, mongoose.Model<IUserModel>>(
  'users',
  schema
);
