import {Router} from 'express';
import { createTenderController, listTenderController, listCompanyTendersController, listTenderIdController, deleteTenderController } from '../controllers/tenderController.js';
import {authenticate} from '../middlewares/authMiddleware.js'
const tenderRoutes = Router();


tenderRoutes.post('/create', authenticate, createTenderController);
tenderRoutes.get('/list', authenticate, listTenderController);
tenderRoutes.get('/list/:tenderId', authenticate, listTenderIdController);
tenderRoutes.get('/mytender', authenticate, listCompanyTendersController);
tenderRoutes.delete('/delete/:tenderId', authenticate, deleteTenderController);

export default tenderRoutes;