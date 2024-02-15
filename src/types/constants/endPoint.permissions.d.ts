import { FastifyRequest } from "fastify";
import {PermissionId} from "../../constants/permissions";
import {UserRoleId} from "../../constants/userRoles";

export interface IEndPointPermission {
    permissionId: PermissionId[],
    userRoleId: UserRoleId
}

export type IEndPointPermissionFunc = (req: FastifyRequest) => IEndPointPermission;

