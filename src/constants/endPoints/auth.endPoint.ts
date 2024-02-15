import {EndPoints} from "./index";
import {PathUtil} from "../../utils/path.util";

export class AuthEndPoint {
    private mainPath: string;

    constructor(mainPath = EndPoints.AUTH) {
        this.mainPath = mainPath;
    }

    get GET() { return PathUtil.createPath(this.mainPath, "/get"); }
    get LOGIN() { return PathUtil.createPath(this.mainPath, "/login"); }
    get LOGOUT() { return PathUtil.createPath(this.mainPath, "/logout"); }
}