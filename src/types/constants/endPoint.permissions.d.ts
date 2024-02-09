import { FastifyRequest } from "fastify";
import {PermissionId} from "../../constants/permissions";
import {UserRoleId} from "../../constants/userRoles";

export interface EndPointPermissionDocument {
    permissionId: PermissionId[],
    minUserRoleId: UserRoleId
}

export type EndPointPermissionDocumentFunc = (req: FastifyRequest) => EndPointPermissionDocument;

