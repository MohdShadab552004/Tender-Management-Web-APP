import {Router} from 'express';
import { createTenderController, listTenderController, listCompanyTendersController, listTenderIdController, deleteTenderController } from '../controllers/tenderController.js';
import {authenticate} from '../middlewares/authMiddleware.js'
import { tenderSchema } from '../validation/tenderSchema.js';
import { validate } from '../middlewares/validate.js';
const tenderRoutes = Router();


tenderRoutes.post('/create', authenticate, validate(tenderSchema), createTenderController);
tenderRoutes.get('/list', authenticate, listTenderController);
tenderRoutes.get('/list/:tenderId', authenticate, listTenderIdController);
tenderRoutes.get('/mytender', authenticate, listCompanyTendersController);
tenderRoutes.delete('/delete/:tenderId', authenticate, deleteTenderController);

export default tenderRoutes;