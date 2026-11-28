// src/modules/auth/auth.validation.ts
// Step 1: Import Zod and role constants
import { z } from "zod";
import { USER_ROLE } from "../../types";

// Step 2: Define signup validation schema
export const signupZodSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Name is required" })
      .trim()
      .min(1, "Name cannot be empty"),
    email: z
      .string({ message: "Email is required" })
      .trim()
      .toLowerCase()
      .email("Invalid email address"),
    password: z
      .string({ message: "Password is required" })
      .min(6, "Password must be at least 6 characters"),
    role: z
      .enum([USER_ROLE.attendee, USER_ROLE.organizer], {
        message: "Role must be either attendee or organizer",
      })
      .optional(),
  }),
});

// Step 3: Define login validation schema
export const loginZodSchema = z.object({
  body: z.object({
    email: z
      .string({ message: "Email is required" })
      .trim()
      .toLowerCase()
      .email("Invalid email address"),
    password: z
      .string({ message: "Password is required" })
      .min(1, "Password is required"),
  }),
});