// src/modules/auth/auth.interface.ts
// Step 1: Import Role type
import { Role } from "../../types";

// Step 2: Define signup payload interface
export interface ISignupPayload {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

// Step 3: Define login payload interface
export interface ILoginPayload {
  email: string;
  password: string;
}

// Step 4: Define safe user shape without password
export interface IUserResponse {
  id: number;
  name: string;
  email: string;
  role: Role;
  created_at: Date;
  updated_at: Date;
}

// Step 5: Define login response shape
export interface ILoginResponse {
  token: string;
  user: IUserResponse;
}