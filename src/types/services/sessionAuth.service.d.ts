import { UserRoleId } from '@constants/userRoles';

export interface ISessionAuthUserResultService {
  userId: string;
  roleId: UserRoleId;
  email: string;
  name: string;
  url: string;
  image: string;
  ip: string;
  permissions: number[];
  token?: string;
  createdAt?: Date;
  updatedAt?: Date;
  refreshedAt?: Date;
}

export interface ISessionAuthResultService {
  _id?: string;
  user: ISessionAuthUserResultService;
}
