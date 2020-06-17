import { ErrorResponse } from '../types';

export const INVALID_RESPONSE = 'INVALID_RESPONSE';
export const MODULE_NOT_FOUND = 'MODULE_NOT_FOUND';
export const USER_NOT_AUTHENTICATED = 'USER_NOT_AUTHENTICATED';
export const ACCESS_TOKEN_REQUEST_FAILED = 'ACCESS_TOKEN_REQUEST_FAILED';
export const NO_OAUTH_CONSUMER_CLIENT_ID = 'NO_OAUTH_CONSUMER_CLIENT_ID';
export const USER_ALREADY_DENIED_ACCESS = 'USER_ALREADY_DENIED_ACCESS';
export const USER_DENIED_ACCESS = 'USER_DENIED_ACCESS';
export const FRAME_SRC_CONSUMER_CALLBACK_MISMATCH =
  'FRAME_SRC_CONSUMER_CALLBACK_MISMATCH';

export function errorMessage(code?: string) {
  switch (code) {
    case INVALID_RESPONSE:
      return 'Invalid response';
    case MODULE_NOT_FOUND:
      return 'Module not found';
    case USER_NOT_AUTHENTICATED:
      return 'User is not authenticated';
    case ACCESS_TOKEN_REQUEST_FAILED:
      return 'Request for access token failed';
    case NO_OAUTH_CONSUMER_CLIENT_ID:
      return 'App does not have an OAuth consumer client ID';
    case USER_ALREADY_DENIED_ACCESS:
      return 'User has already denied access to app';
    case USER_DENIED_ACCESS:
      return 'User denied access to app';
    case FRAME_SRC_CONSUMER_CALLBACK_MISMATCH:
      return 'Module URL must start with the OAuth consumer callback URL';
    default:
      return 'Error';
  }
}

export function errorResponse(code: string, message?: string): ErrorResponse {
  return {
    code,
    message: message || errorMessage(code),
  };
}
