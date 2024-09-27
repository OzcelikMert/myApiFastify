export enum ApiErrorCodes {
    success = 0,
    incorrectData,
    emptyValue,
    wrongValue,
    registeredData,
    sqlSyntax,
    notFound,
    uploadError,
    notLoggedIn,
    noPerm,
    ipBlock,
    wrongPassword,
    notSameValues
}

export function getApiErrorCodeMessage(apiErrorCode: ApiErrorCodes) {
    let message = "";
    switch (apiErrorCode) {
        case ApiErrorCodes.success:
            message = "Success";
            break;
        case ApiErrorCodes.incorrectData:
            message = "Incorrect Data";
            break;
        case ApiErrorCodes.emptyValue:
            message = "Empty Value";
            break;
        case ApiErrorCodes.wrongValue:
            message = "Wrong Value";
            break;
        case ApiErrorCodes.registeredData:
            message = "Registered Value";
            break;
        case ApiErrorCodes.sqlSyntax:
            message = "SQL Syntax";
            break;
        case ApiErrorCodes.notFound:
            message = "Not Found";
            break;
        case ApiErrorCodes.uploadError:
            message = "Upload Error";
            break;
        case ApiErrorCodes.notLoggedIn:
            message = "Not Logged In";
            break;
        case ApiErrorCodes.noPerm:
            message = "No Perm";
            break;
        case ApiErrorCodes.ipBlock:
            message = "IP Block";
            break;
        case ApiErrorCodes.wrongPassword:
            message = "Wrong Password";
            break;
        case ApiErrorCodes.notSameValues:
            message = "Success";
            break;
    }
    return message;
}