// src/utils/sendResponse.ts
// Step 1: Define response payload type
import { Response } from "express";
import { TErrorDetail } from "./AppError";

export type TResponse<T> = {
  statusCode: number;
  success?: boolean;
  message: string;
  data?: T | null;
  errors?: TErrorDetail[];
};

// Step 2: Send standardized JSON response
const sendResponse = <T>(res: Response, payload: TResponse<T>): Response | void => {
  if (res.headersSent) {
    return;
  }

  const isSuccess = payload.success ?? payload.statusCode < 400;

  return res.status(payload.statusCode).json({
    success: isSuccess,
    message: payload.message,
    data: payload.data ?? null,
    ...(!isSuccess && payload.errors && payload.errors.length > 0
      ? { errors: payload.errors }
      : {}),
  });
};

export default sendResponse;