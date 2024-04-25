import {EndPoints} from "@constants/endPoints/index";
import {PathUtil} from "@utils/path.util";

export class PostEndPoint {
    private mainPath: string;

    constructor(mainPath = EndPoints.POST) {
        this.mainPath = mainPath;
    }

    get GET() { return PathUtil.createPath(this.mainPath, "/get"); }
    get GET_WITH_ID() { return PathUtil.createPath(this.mainPath, `/get/:_id`); }
    get GET_WITH_URL() { return PathUtil.createPath(this.mainPath, `/get/url/:url`); }
    get GET_PREV_NEXT_WITH_ID() { return PathUtil.createPath(this.mainPath, "/get/prev-next/:_id"); }
    get GET_COUNT() { return PathUtil.createPath(this.mainPath, "/get/count"); }
    get ADD() { return PathUtil.createPath(this.mainPath, "/add"); }
    get ADD_PRODUCT() { return PathUtil.createPath(this.mainPath, "/add/product"); }
    get UPDATE_WITH_ID() { return PathUtil.createPath(this.mainPath, `/update/:_id`); }
    get UPDATE_PRODUCT_WITH_ID() { return PathUtil.createPath(this.mainPath, `/update/product/:_id`); }
    get UPDATE_VIEW_WITH_ID() { return PathUtil.createPath(this.mainPath, `/update/view/:_id`); }
    get UPDATE_RANK_WITH_ID() { return PathUtil.createPath(this.mainPath, `/update/rank/:_id`); }
    get UPDATE_STATUS() { return PathUtil.createPath(this.mainPath, "/update/status"); }
    get DELETE() { return PathUtil.createPath(this.mainPath, "/delete"); }
}