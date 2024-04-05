import {EndPoints} from "@constants/endPoints/index";
import {PathUtil} from "@utils/path.util";

export class MailerEndPoint {
    private mainPath: string;

    constructor(mainPath = EndPoints.MAILER) {
        this.mainPath = mainPath;
    }

    get SEND() { return PathUtil.createPath(this.mainPath, "/send"); }
}