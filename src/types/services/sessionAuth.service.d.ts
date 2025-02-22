import { UserRoleId } from '@constants/userRoles';

export interface ISessionAuthUser {
  userId: string;
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

export interface ISessionAuth {
  _id?: string;
  user: ISessionAuthUser;
}
