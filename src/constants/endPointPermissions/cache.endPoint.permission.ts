import { IEndPointPermission } from 'types/constants/endPoint.permissions';
import { PermissionId } from '@constants/permissions';
import { UserRoleId } from '@constants/userRoles';

const remove: IEndPointPermission = {
  permissionId: [],
  userRoleId: UserRoleId.Admin,
};

export const CacheEndPointPermission = {
  DELETE: remove,
};
