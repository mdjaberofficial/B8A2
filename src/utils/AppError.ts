export interface TErrorDetail {
  field?: string | number;
  message: string;
}

// Step 2: Create custom AppError class with HTTP status code
class AppError extends Error {
  public statusCode: number;
  public errors?: TErrorDetail[];

  // Step 3: Initialize error properties and stack trace
  constructor(statusCode: number, message: string, errors?: TErrorDetail[]) {
    super(message);
    this.statusCode = statusCode;
    if (errors && errors.length > 0) {
      this.errors = errors;
    }
    this.name = "AppError";
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;