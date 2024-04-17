import {EndPoints} from "@constants/endPoints/index";
import {PathUtil} from "@utils/path.util";

export class PostCommentEndPoint {
    private mainPath: string;

    constructor(mainPath = EndPoints.POST_COMMENT) {
        this.mainPath = mainPath;
    }

    get GET() { return PathUtil.createPath(this.mainPath, "/get"); }
    get GET_WITH_ID() { return PathUtil.createPath(this.mainPath, `/get/:_id`); }
    get ADD() { return PathUtil.createPath(this.mainPath, "/add"); }
    get UPDATE_LIKE_WITH_ID() { return PathUtil.createPath(this.mainPath, `/update/like/:_id`); }
    get UPDATE_STATUS() { return PathUtil.createPath(this.mainPath, "/update/status"); }
    get DELETE() { return PathUtil.createPath(this.mainPath, "/delete"); }
}