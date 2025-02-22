import { IUserModel } from 'types/models/user.model';
import { StatusId } from '@constants/status';
import { UserRoleId } from '@constants/userRoles';
import { PermissionId } from '@constants/permissions';

export interface IUserPopulateService {
  _id: string;
  name: string;
  url: string;
  image: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

export type IUserGetDetailedResultService = {
  isOnline?: boolean;
  password?: string;
  username?: string;
  author?: IUserPopulateService;
  lastAuthor?: IUserPopulateService;
} & Omit<IUserModel, 'password' | 'username'>;

export interface IUserGetParamService {
  _id?: string;
  username?: string;
  password?: string;
  statusId?: StatusId;
  url?: string;
  roleId?: UserRoleId;
  ignoreUserId?: string[];
}

export interface IUserGetManyParamService {
  _id?: string[];
  statusId?: StatusId;
  url?: string;
  permissions?: PermissionId[];
  ignoreUserId?: string[];
  banDateEnd?: Date;
}

export interface IUserGetDetailedParamService {
  _id?: string;
  password?: string;
  statusId?: StatusId;
  url?: string;
  roleId?: UserRoleId;
  ignoreUserId?: string[];
}

export interface IUserGetManyDetailedParamService {
  _id?: string[];
  statusId?: StatusId;
  url?: url;
  count?: number;
  page?: number;
  permissions?: PermissionId[];
  ignoreUserId?: string[];
  banDateEnd?: Date;
}

export type IUserAddParamService = {
  image?: string;
} & Omit<IUserModel, '_id' | 'image'>;

export type IUserUpdateParamService = {
  _id: string;
} & Omit<Partial<IUserAddParamService>, '_id'>;

export type IUserUpdateStatusManyParamService = {
  _id: string[];
  statusId: StatusId;
  lastAuthorId?: string;
};

export type IUserDeleteParamService = {
  _id: string;
  lastAuthorId: string;
};
