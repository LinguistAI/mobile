import { AxiosError } from "axios";

interface CustomError {
  response: {
    data: {
      msg: string;
      status: number;
      timestamp: string;
    };
  };
}

export function isStatusOk(statusCode: number | null | undefined): boolean {
  if (!statusCode) {
    return false;
  }
  return statusCode >= 200 && statusCode < 300;
}

export function isCustomError(error: any): error is CustomError {
  return (
    error.response.data.msg &&
    error.response.data.status &&
    error.response.data.timestamp
  );
}

export function generateErrorResponseMessage(error: any, defaultMsg: string="") {
  if (error instanceof AxiosError) {
    console.log(error.code)
    switch (error.code) {
      case "ERR_NETWORK":
        return "A network error has occurred. Please check your internet connection and try again.";
      case "ERR_BAD_RESPONSE":
        return "We are experiencing an unexpected error, we are working on it at the moment. Thanks for your patience."
    }
  }


  if (isCustomError(error)) {
    return error.response.data.msg;
  }

  return defaultMsg !== "" ? defaultMsg : "An unknown error has occurred. Please try again.";
}
