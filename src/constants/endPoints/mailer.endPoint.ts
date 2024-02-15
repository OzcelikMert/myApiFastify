import {PathUtil} from "../../utils/path.util";
import {EndPoints} from "./index";

export class MailerEndPoint {
    private mainPath: string;

    constructor(mainPath = EndPoints.MAILER) {
        this.mainPath = mainPath;
    }

    get SEND() { return PathUtil.createPath(this.mainPath, "/send"); }
}