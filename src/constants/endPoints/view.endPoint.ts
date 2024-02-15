import {EndPoints} from "./index";
import {PathUtil} from "../../utils/path.util";

export class ViewEndPoint {
    private mainPath: string;

    constructor(mainPath = EndPoints.VIEW) {
        this.mainPath = mainPath;
    }

    get GET_NUMBER() { return PathUtil.createPath(this.mainPath, "/get/number"); }
    get GET_STATISTICS() { return PathUtil.createPath(this.mainPath, "/get/statistics"); }
    get ADD() { return PathUtil.createPath(this.mainPath, "/add"); }
}