import { AxiosError } from 'axios';

interface CustomError {
  msg: string;
  status: number;
  timestamp: string;
}

export function isStatusOk(statusCode: number | null | undefined): boolean {
  if (!statusCode) {
    return false;
  }
  return statusCode >= 200 && statusCode < 300;
}

export function isCustomError(error: any): error is CustomError {
  return error?.msg;
}

export function generateErrorResponseMessage(error: any, defaultMsg: string = '') {
  if (error instanceof AxiosError) {
    switch (error.code) {
      case 'ERR_NETWORK':
        return 'A network error has occurred. Please check your internet connection and try again.';
      case 'ERR_BAD_RESPONSE':
        return 'We are experiencing an unexpected error, we are working on it at the moment. Thanks for your patience.';
    }
  }
  if (error?.response) {
    return error?.response?.data?.msg;
  }

  if (isCustomError(error)) {
    return error?.msg || defaultMsg || 'An unknown error has occurred. Please try again.';
  }

  return defaultMsg !== '' ? defaultMsg : 'An unknown error has occurred. Please try again.';
}
