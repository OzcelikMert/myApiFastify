import {ApiErrorCodes, getApiErrorCodeMessage} from "./errorCodes";
import {ApiStatusCodes, getApiStatusCodeMessage} from "./statusCodes";

export class ApiResult<Data = null, CustomData = null> {
    private errorCode: ApiErrorCodes = ApiErrorCodes.success;
    private errorCodeMessage: string = "";
    get getErrorCode () { return this.errorCode; }
    set setErrorCode (errorCode: ApiErrorCodes) {
        this.errorCode = errorCode;
        this.errorCodeMessage = getApiErrorCodeMessage(errorCode);
    }

    private statusCode: ApiStatusCodes = ApiStatusCodes.success;
    private statusCodeMessage: string = "";
    get getStatusCode () { return this.statusCode; }
    set setStatusCode (statusCode: ApiStatusCodes) {
        this.statusCode = statusCode;
        this.statusCodeMessage = getApiStatusCodeMessage(statusCode);
    }

    constructor(
        data: any = null,
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
        this.setStatusCode = statusCode;
        this.setErrorCode = errorCode;
        this.source = source;
    }



    data: Data | null;
    customData: CustomData;
    status: boolean;
    message: any;
    source: string;
}