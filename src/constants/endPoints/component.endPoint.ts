import {PathUtil} from "../../utils/path.util";
import {EndPoints} from "./index";

export class ComponentEndPoint {
    private mainPath: string;

    constructor(mainPath = EndPoints.COMPONENT) {
        this.mainPath = mainPath;
    }

    get GET() { return PathUtil.createPath(this.mainPath, "/get"); }
    get GET_WITH_ID() { return PathUtil.createPath(this.mainPath, `/get/:_id`); }
    get GET_WITH_ELEMENT_ID() { return PathUtil.createPath(this.mainPath, `/get/element-id/:elementId`); }
    get ADD() { return PathUtil.createPath(this.mainPath, "/add"); }
    get UPDATE_WITH_ID() { return PathUtil.createPath(this.mainPath, `/update/:_id`); }
    get DELETE() { return PathUtil.createPath(this.mainPath, "/delete"); }
}