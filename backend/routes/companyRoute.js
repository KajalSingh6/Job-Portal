import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { singleUpload } from '../middleware/multer.js';
import { getCompany, getCompanyById, registerCompany, updateCompany } from '../controllers/companyController.js';
import { body } from 'express-validator';

const companyRouter = express.Router();

const companyValidation = [
    body('name', 'Company name must be at least 2 characters').isLength({min:2}),
    body('description', 'Description must be a string').isString(),
    body('website', 'Website must be a valid URL').isURL(),
    body('location','Location must be a string').isString(),
];

companyRouter.post('/register', isAuthenticated, registerCompany);
companyRouter.get('/get', isAuthenticated, getCompany);
companyRouter.get('/get/:id', isAuthenticated, getCompanyById);
companyRouter.put('/update/:id', isAuthenticated, singleUpload, companyValidation, updateCompany);


export default companyRouter;