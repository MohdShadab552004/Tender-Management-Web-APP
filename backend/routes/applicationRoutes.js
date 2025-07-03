import { Router } from "express";
import {getProposalsController, submitProposalsController} from '../controllers/applicationController.js'
import {authenticate} from '../middlewares/authMiddleware.js'

const applicationRouter = Router();

applicationRouter.post('/send',authenticate, submitProposalsController);
applicationRouter.get('/:tenderId',authenticate, getProposalsController);

export default applicationRouter;