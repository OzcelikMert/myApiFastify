import UserRoles, {UserRoleId} from "../constants/userRoles";
import PermissionPaths from "../constants/permissions";

export default {
    checkPermissionPath(path: string, method: string, userRoleId: UserRoleId, userPermissions: number[]){
        method = method.toUpperCase();
        for(const permissionPath of PermissionPaths) {
            if(path.startsWith(permissionPath.path)){
                for (const permissionPathMethod of permissionPath.methods) {
                    if(permissionPathMethod.method == method){
                        if(
                            userRoleId != UserRoleId.SuperAdmin &&
                            permissionPathMethod.permissionId &&
                            !userPermissions.includes(permissionPathMethod.permissionId)
                        ){
                            return false;
                        }

                        if(permissionPathMethod.userRoleId){
                            let permPathUserRole = UserRoles.findSingle("id", permissionPathMethod.userRoleId);
                            let userRole = UserRoles.findSingle("id", userRoleId);
                            if(
                                (typeof permPathUserRole === "undefined" || typeof userRole === "undefined") ||
                                (userRole.rank < permPathUserRole.rank)
                            ){
                                return false;
                            }
                        }
                    }
                }
            }
        }
        return true;
    }
}