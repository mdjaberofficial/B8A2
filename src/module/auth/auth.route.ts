import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { authController } from "./auth.controller";
import { loginZodSchema, signupZodSchema } from "./auth.validation";


const router = Router();


router.post("/signup", validateRequest(signupZodSchema), authController.signup);
router.post("/login", validateRequest(loginZodSchema), authController.login);


export const authRoutes = router;