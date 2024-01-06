import {PermissionPathDocument} from "../../types/constants/permissionPaths";

import userPermissionPath from "./user.permissionPath";
import galleryPermissionPath from "./gallery.permissionPath";
import serverInfoPermissionPath from "./serverInfo.permissionPath";
import subscriberPermissionPath from "./subscriber.permissionPath";
import settingPermissionPath from "./setting.permissionPath";
import componentPermissionPath from "./component.permissionPath";
import postPermissionPath from "./post.permissionPath";
import postTermPermissionPath from "./postTerm.permissionPath";
import navigationPermissionPath from "./navigation.permissionPath";
import languagePermissionPath from "./language.permissionPath";

const PermissionPaths: PermissionPathDocument[] = [
    ...userPermissionPath,
    ...galleryPermissionPath,
    ...serverInfoPermissionPath,
    ...subscriberPermissionPath,
    ...settingPermissionPath,
    ...componentPermissionPath,
    ...postPermissionPath,
    ...postTermPermissionPath,
    ...navigationPermissionPath,
    ...languagePermissionPath
];

export default PermissionPaths;