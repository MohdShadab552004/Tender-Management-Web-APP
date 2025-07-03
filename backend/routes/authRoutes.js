import { Router } from "express";
import { registerController, loginController } from "../controllers/authController.js";
import { userSchema } from "../validation/userSchema.js";
import { validate } from "../middlewares/validate.js"

const authRoutes = Router();

authRoutes.post('/register',validate(userSchema), registerController);
authRoutes.post('/login',validate(userSchema), loginController);

export default authRoutes;