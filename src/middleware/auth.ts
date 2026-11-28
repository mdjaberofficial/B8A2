import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import { Role } from "../types";
import AppError from "../utils/AppError";

const auth = (...allowedRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.trim()) {
        throw new AppError(401, "Unauthorized access! No token provided.");
      }

      
      if (!config.jwt_secret) {
        throw new AppError(500, "Internal Server Error");
      }

      
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7).trim()
        : authHeader.trim();

      if (!token) {
        throw new AppError(401, "Unauthorized access! Invalid token format.");
      }

      
      let decoded: { id?: number | string; role?: string };
      try {
        decoded = jwt.verify(token, config.jwt_secret) as { id?: number | string; role?: string };
      } catch {
        throw new AppError(401, "Unauthorized access! Invalid or expired token.");
      }

      const userId = Number(decoded.id);
      if (!decoded.id || Number.isNaN(userId) || !decoded.role) {
        throw new AppError(401, "Unauthorized access! Invalid token payload.");
      }

      
      const result = await pool.query(
        `
        SELECT id, role
        FROM users
        WHERE id = $1
        `,
        [userId]
      );

      if (result.rowCount === 0 || !result.rows[0]) {
        throw new AppError(401, "Unauthorized access! User not found.");
      }

      const dbUser = result.rows[0] as { id: number; role: Role };

      
      if (allowedRoles.length > 0 && !allowedRoles.includes(dbUser.role)) {
        throw new AppError(403, "Forbidden! You do not have permission to access this resource.");
      }

      
      req.user = {
        id: dbUser.id,
        role: dbUser.role,
      };

      
      next();
    } catch (error) {
      
      next(error);
    }
  };
};

export default auth;