import {EndPoints} from "./index";
import {PathUtil} from "../../utils/path.util";

export class SettingEndPoint {
    private mainPath: string;

    constructor(mainPath = EndPoints.SETTING) {
        this.mainPath = mainPath;
    }

    get GET() { return PathUtil.createPath(this.mainPath, "/get"); }
    get UPDATE_GENERAL() { return PathUtil.createPath(this.mainPath, "/update/general"); }
    get UPDATE_SEO() { return PathUtil.createPath(this.mainPath, "/update/seo"); }
    get UPDATE_CONTACT_FORM() { return PathUtil.createPath(this.mainPath, "/update/contact-form"); }
    get UPDATE_SOCIAL_MEDIA() { return PathUtil.createPath(this.mainPath, "/update/social-media"); }
    get UPDATE_ECOMMERCE() { return PathUtil.createPath(this.mainPath, "/update/ecommerce"); }
    get UPDATE_PATH() { return PathUtil.createPath(this.mainPath, "/update/path"); }
}