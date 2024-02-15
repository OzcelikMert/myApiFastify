import {PathUtil} from "../../utils/path.util";
import {EndPoints} from "./index";

export class ServerInfoEndPoint {
    private mainPath: string;

    constructor(mainPath = EndPoints.SERVER_INFO) {
        this.mainPath = mainPath;
    }

    get GET() { return PathUtil.createPath(this.mainPath, "/get"); }
}