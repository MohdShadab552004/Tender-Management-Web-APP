import {Router} from 'express';
import upload from '../config/upload.js';
import {createCompaniesController, searchCompaniesController} from '../controllers/companiesController.js';
import { authenticate} from '../middlewares/authMiddleware.js';



const companiesRoutes = Router();

companiesRoutes.post('/create', authenticate, upload.single('logo'), createCompaniesController);
companiesRoutes.get('/search', searchCompaniesController);



export default companiesRoutes;