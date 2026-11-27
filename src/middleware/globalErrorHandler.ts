
// Step 1: Import Express types, AppError, and sendResponse
import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import sendResponse from "../utils/sendResponse";

// Step 2: Centralized 4-argument Express error handler
const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  // Step 3: Log error for debugging
  console.error("Error:", err);

  // Step 4: Handle custom AppError instances
  if (err instanceof AppError) {
    return sendResponse(res, {
      statusCode: err.statusCode,
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // Step 5: Handle PostgreSQL unique constraint violation (duplicate email)
  if (err?.code === "23505") {
    return sendResponse(res, {
      statusCode: 409,
      success: false,
      message: "Resource already exists",
    });
  }

  // Step 6: Handle PostgreSQL invalid input syntax (e.g. non-numeric id)
  if (err?.code === "22P02") {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Invalid input syntax",
    });
  }

  // Step 7: Handle PostgreSQL foreign key / check constraint errors
  if (err?.code === "23503" || err?.code === "23514") {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Invalid reference or constraint violation",
    });
  }

  // Step 8: Handle malformed JSON body parser errors
  if (err instanceof SyntaxError && "body" in err) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Invalid JSON payload",
    });
  }

  // Step 9: Fallback 500 error without exposing raw SQL or stack traces
  const statusCode = typeof err?.statusCode === "number" ? err.statusCode : 500;
  return sendResponse(res, {
    statusCode,
    success: false,
    message: statusCode === 500 ? "Internal Server Error" : err?.message || "Request Failed",
  });
};

export default globalErrorHandler;