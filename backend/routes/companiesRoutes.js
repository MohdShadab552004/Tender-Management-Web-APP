import {Router} from 'express';
import upload from '../config/upload.js';
import {allCompaniesController, createCompaniesController, searchCompaniesController} from '../controllers/companiesController.js';
import { authenticate} from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { companySchema } from '../validation/companySchema.js';



const companiesRoutes = Router();

companiesRoutes.post('/create', authenticate, upload.single('logo'),  validate(companySchema),createCompaniesController);
companiesRoutes.get('/search', searchCompaniesController);
companiesRoutes.get('/all',allCompaniesController);


export default companiesRoutes;