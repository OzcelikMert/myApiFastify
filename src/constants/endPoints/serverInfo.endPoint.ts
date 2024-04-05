import {EndPoints} from "@constants/endPoints/index";
import {PathUtil} from "@utils/path.util";

export class ServerInfoEndPoint {
    private mainPath: string;

    constructor(mainPath = EndPoints.SERVER_INFO) {
        this.mainPath = mainPath;
    }

    get GET() { return PathUtil.createPath(this.mainPath, "/get"); }
}