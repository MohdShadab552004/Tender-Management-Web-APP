import {Router} from "express";
import { myProfileController, updateProfileController } from "../controllers/profileController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
const profileRoutes = Router();

profileRoutes.get('/', authenticate, myProfileController);
profileRoutes.put('/edit',authenticate, updateProfileController)

export default profileRoutes;