// src/modules/auth/auth.controller.ts
// Step 1: Import Express types, authService, and sendResponse
import { NextFunction, Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";
import { authService } from "./auth.service";

// Step 2: Handle POST /api/v1/auth/signup
const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Step 3: Create user via service
    const user = await authService.signupUser(req.body);

    // Step 4: Return 201 Created response
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    // Step 5: Forward errors to global error handler
    next(error);
  }
};

// Step 6: Handle POST /api/v1/auth/login
const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Step 7: Authenticate user and generate token
    const result = await authService.loginUser(req.body);

    // Step 8: Return 200 OK with token and user
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    // Step 9: Forward errors to global error handler
    next(error);
  }
};

export const authController = {
  signup,
  login,
};