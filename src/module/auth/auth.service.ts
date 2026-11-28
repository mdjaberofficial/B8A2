// src/modules/auth/auth.service.ts
// Step 1: Import bcrypt, jwt, DB pool, config, AppError, and auth interfaces
import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { pool } from "../../db";
import { USER_ROLE } from "../../types";
import AppError from "../../utils/AppError";
import {
  ILoginPayload,
  ILoginResponse,
  ISignupPayload,
  IUserResponse,
} from "./auth.interface";

// Step 2: Register a new user with hashed password and default attendee role
const signupUser = async (payload: ISignupPayload): Promise<IUserResponse> => {
  // Step 3: Normalize email and resolve role
  const normalizedEmail = payload.email.trim().toLowerCase();
  const role = payload.role ?? USER_ROLE.attendee;

  // Step 4: Check if email already exists
  const existingUser = await pool.query(
    `
    SELECT id
    FROM users
    WHERE email = $1
    `,
    [normalizedEmail]
  );

  if (existingUser.rowCount && existingUser.rowCount > 0) {
    throw new AppError(409, "User with this email already exists");
  }

  // Step 5: Hash password with bcrypt
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(payload.password, saltRounds);

  // Step 6: Insert user and return safe columns (never return password)
  const inserted = await pool.query(
    `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at, updated_at
    `,
    [payload.name.trim(), normalizedEmail, hashedPassword, role]
  );

  const user = inserted.rows[0] as IUserResponse;
  return user;
};

// Step 7: Authenticate user credentials and return JWT + user profile
const loginUser = async (payload: ILoginPayload): Promise<ILoginResponse> => {
  // Step 8: Normalize email and look up user including password hash
  const normalizedEmail = payload.email.trim().toLowerCase();

  const result = await pool.query(
    `
    SELECT id, name, email, password, role, created_at, updated_at
    FROM users
    WHERE email = $1
    `,
    [normalizedEmail]
  );

  const dbUser = result.rows[0] as
    | (IUserResponse & { password: string })
    | undefined;

  if (!dbUser) {
    throw new AppError(401, "Invalid email or password");
  }

  // Step 9: Compare submitted password with stored hash
  const isPasswordMatch = await bcrypt.compare(payload.password, dbUser.password);
  if (!isPasswordMatch) {
    throw new AppError(401, "Invalid email or password");
  }

  // Step 10: Verify JWT secret is available
  if (!config.jwt_secret) {
    throw new AppError(500, "Internal Server Error");
  }

  // Step 11: Sign JWT with { id, role } payload
  const signOptions: SignOptions = {
    expiresIn: config.jwt_expires_in as SignOptions["expiresIn"],
  };

  const token = jwt.sign(
    {
      id: dbUser.id,
      role: dbUser.role,
    },
    config.jwt_secret,
    signOptions
  );

  // Step 12: Strip password field before returning user data
  const { password: _password, ...safeUser } = dbUser;

  return {
    token,
    user: safeUser,
  };
};

export const authService = {
  signupUser,
  loginUser,
};