import * as mongoose from 'mongoose';
import { userModel } from '@models/user.model';
import { UserRoleId } from '@constants/userRoles';
import {
  ISessionAuthModel,
  ISessionAuthUserModel,
} from 'types/models/sessionAuth.model';

const schemaUser = new mongoose.Schema<ISessionAuthUserModel>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: userModel },
    roleId: { type: Number, required: true, enum: UserRoleId },
    ip: { type: String, default: '', required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    url: { type: String, required: true },
    permissions: { type: [Number], default: [] },
    refreshedAt: { type: Date, default: '' },
  },
  { timestamps: true }
);

const schema = new mongoose.Schema<ISessionAuthModel>(
  {
    user: { type: schemaUser, required: true },
  },
  { timestamps: true }
);

export const sessionAuthModel = mongoose.model<
  ISessionAuthModel,
  mongoose.Model<ISessionAuthModel>
>('sessionAuth', schema);
