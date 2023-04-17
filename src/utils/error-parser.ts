import { openSnackbar } from "@store/ui-reducer";
import { AxiosResponse } from "axios";

export const ErrorParser = (error: any, dispatch?: any): any => {
  let message = "Server error";
  try {
    const errResponse = error.response as AxiosResponse<any>;
    if (errResponse && errResponse.status !== 500) {
      message = errResponse.data.error;
    }
  } catch (err) {
    message = "Server error";
  }

  if (dispatch) {
    dispatch(openSnackbar({ message, severity: "error" }));
  }
  throw new Error(error);
};

const isJson = (str: string) => {
  try {
    return !!JSON.parse(JSON.stringify(str));
  } catch (e) {
    return false;
  }
};

export const METAMASK_POSSIBLE_ERRORS = {
  "-32700": {
    standard: "JSON RPC 2.0",
    message:
      "Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."
  },
  "-32600": {
    standard: "JSON RPC 2.0",
    message: "The JSON sent is not a valid Request object."
  },
  "-32601": {
    standard: "JSON RPC 2.0",
    message: "The method does not exist / is not available."
  },
  "-32602": {
    standard: "JSON RPC 2.0",
    message: "Invalid method parameter(s)."
  },
  // '-32603': {
  //   standard: 'JSON RPC 2.0',
  //   message: 'Internal JSON-RPC error.',
  // },
  "-32000": {
    standard: "EIP-1474",
    message: "Invalid input."
  },
  "-32001": {
    standard: "EIP-1474",
    message: "Resource not found."
  },
  "-32002": {
    standard: "EIP-1474",
    message: "Resource unavailable."
  },
  "-32003": {
    standard: "EIP-1474",
    message: "Transaction rejected."
  },
  "-32004": {
    standard: "EIP-1474",
    message: "Method not supported."
  },
  "-32005": {
    standard: "EIP-1474",
    message: "Request limit exceeded."
  },
  "4001": {
    standard: "EIP-1193",
    message: "User rejected the request."
  },
  "4100": {
    standard: "EIP-1193",
    message:
      "The requested account and/or method has not been authorized by the user."
  },
  "4200": {
    standard: "EIP-1193",
    message: "The requested method is not supported by this Ethereum provider."
  },
  "4900": {
    standard: "EIP-1193",
    message: "The provider is disconnected from all chains."
  },
  "4901": {
    standard: "EIP-1193",
    message: "The provider is disconnected from the specified chain."
  }
};

export const ParseSWErrorMessage = (error: any) => {
  if (!error) {
    return error;
  }

  if (isJson(error)) {
    error = JSON.parse(JSON.stringify(error));
  }

  const metamaskError = METAMASK_POSSIBLE_ERRORS[error?.code];

  if (metamaskError) {
    return metamaskError.message;
  }

  if (error?.reason) {
    return error?.reason?.toString();
  }

  if (error instanceof TypeError || error instanceof Error) {
    error = error.message?.toString();
  }

  if (error?.data?.message) {
    error = error?.data?.message?.toString();
  }

  if (typeof error !== "string") {
    console.error(error);
    throw new Error("SW smart contract error message is not a string!");
  }

  const [mainMsg, fullSwMsg] = error.split("execution reverted:");
  const [swMainMsg, parsedMsg] = (fullSwMsg || "").split("Aut:");

  return (
    parsedMsg ||
    swMainMsg ||
    fullSwMsg ||
    mainMsg ||
    "Internal JSON-RPC error."
  ).toString();
};
