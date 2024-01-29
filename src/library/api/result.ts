import ErrorCodes from "./errorCodes";
import StatusCodes from "./statusCodes";

class Result {
    constructor(
        data: any = [],
        customData: any = null,
        status: boolean = true,
        message: any = "",
        errorCode: ErrorCodes = ErrorCodes.success,
        statusCode: StatusCodes = StatusCodes.success,
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
    errorCode: ErrorCodes;
    statusCode: StatusCodes;
    source: string;
}

export default Result;