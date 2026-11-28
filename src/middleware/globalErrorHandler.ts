import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import sendResponse from "../utils/sendResponse";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  console.error("Error:", err);

  if (err instanceof AppError) {
    return sendResponse(res, {
      statusCode: err.statusCode,
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  if (err?.code === "23505") {
    return sendResponse(res, {
      statusCode: 409,
      success: false,
      message: "Resource already exists",
    });
  }

  if (err?.code === "22P02") {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Invalid input syntax",
    });
  }

  if (err?.code === "23503" || err?.code === "23514") {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Invalid reference or constraint violation",
    });
  }

  if (err instanceof SyntaxError && "body" in err) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Invalid JSON payload",
    });
  }

  const statusCode = typeof err?.statusCode === "number" ? err.statusCode : 500;
  return sendResponse(res, {
    statusCode,
    success: false,
    message: statusCode === 500 ? "Internal Server Error" : err?.message || "Request Failed",
  });
};

export default globalErrorHandler;