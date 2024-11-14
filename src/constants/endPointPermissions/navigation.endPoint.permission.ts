import { IEndPointPermission } from 'types/constants/endPoint.permissions';
import { PermissionId } from '@constants/permissions';
import { UserRoleId } from '@constants/userRoles';

const add: IEndPointPermission = {
  permissionId: [PermissionId.NavigationAdd],
  userRoleId: UserRoleId.Editor,
};

const update: IEndPointPermission = {
  permissionId: [PermissionId.NavigationEdit],
  userRoleId: UserRoleId.Editor,
};

const remove: IEndPointPermission = {
  permissionId: [PermissionId.NavigationDelete],
  userRoleId: UserRoleId.Editor,
};

export const NavigationEndPointPermission = {
  ADD: add,
  UPDATE: update,
  DELETE: remove,
};
