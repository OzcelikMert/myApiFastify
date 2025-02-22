import { UserRoleId } from '@constants/userRoles';
import { ObjectId } from 'mongoose';

export interface ISessionAuthUserModel {
  userId: string | ObjectId;
  roleId: UserRoleId;
  username: string;
  email: string;
  name: string;
  url: string;
  image: string;
  ip: string;
  permissions: number[];
  createdAt?: Date;
  updatedAt?: Date;
  refreshedAt?: Date;
}

export interface ISessionAuthModel {
  _id?: string | ObjectId;
  user: ISessionAuthUserModel;
}
