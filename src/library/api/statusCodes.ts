export enum ApiStatusCodes {
  success = 200,
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
  conflict = 409,
}

export function getApiStatusCodeMessage(apiStatusCode: ApiStatusCodes) {
  let message = '';

  switch (apiStatusCode) {
    case ApiStatusCodes.success:
      message = 'Success';
      break;
    case ApiStatusCodes.badRequest:
      message = 'Bad Request';
      break;
    case ApiStatusCodes.unauthorized:
      message = 'Unauthorized';
      break;
    case ApiStatusCodes.forbidden:
      message = 'Forbidden';
      break;
    case ApiStatusCodes.notFound:
      message = 'Not Found';
      break;
    case ApiStatusCodes.conflict:
      message = 'Conflict';
      break;
  }

  return message;
}
