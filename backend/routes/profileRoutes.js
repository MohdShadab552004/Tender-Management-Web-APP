import {Router} from "express";
import { myProfileController, updateProfileController } from "../controllers/profileController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { updateProfileSchema } from "../validation/profileSchema.js";
const profileRoutes = Router();

profileRoutes.get('/', authenticate, myProfileController);
profileRoutes.put('/edit',authenticate, validate(updateProfileSchema), updateProfileController)

export default profileRoutes;