import {ApiErrorCodes} from "./errorCodes";
import {ApiStatusCodes} from "./statusCodes";

export class ApiResult {
    constructor(
        data: any = [],
        customData: any = null,
        status: boolean = true,
        message: any = "",
        errorCode: ApiErrorCodes = ApiErrorCodes.success,
        statusCode: ApiStatusCodes = ApiStatusCodes.success,
        source: string = ""
    ) {
        this.data = data;
        this.customData = customData;
        this.status = status;
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.source = source;
    }

    data: any;
    customData: any;
    status: boolean;
    message: any;
    errorCode: ApiErrorCodes;
    statusCode: ApiStatusCodes;
    source: string;
}