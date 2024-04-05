import {EndPoints} from "@constants/endPoints/index";
import {PathUtil} from "@utils/path.util";

export class SubscriberEndPoint {
    private mainPath: string;

    constructor(mainPath = EndPoints.SUBSCRIBER) {
        this.mainPath = mainPath;
    }

    get GET() { return PathUtil.createPath(this.mainPath, "/get"); }
    get GET_WITH_ID() { return PathUtil.createPath(this.mainPath, `/get/:_id`); }
    get GET_WITH_EMAIL() { return PathUtil.createPath(this.mainPath, `/get/email/:email`); }
    get ADD() { return PathUtil.createPath(this.mainPath, "/add"); }
    get UPDATE_WITH_ID() { return PathUtil.createPath(this.mainPath, `/update/:_id`); }
    get DELETE() { return PathUtil.createPath(this.mainPath, "/delete"); }
    get DELETE_WITH_ID() { return PathUtil.createPath(this.mainPath, `/delete/:_id`); }
    get DELETE_WITH_EMAIL() { return PathUtil.createPath(this.mainPath, `/delete/email/:email`); }

}