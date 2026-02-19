import express from 'express';
import { getAdminJobs, getAllJobs, getJobById, postJob, updateJob } from '../controllers/jobController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { body } from 'express-validator';

const jobRouter = express.Router();

// Job post validation middlerware 
const jobValidation = [
    body('title', 'Title must be at least 5 characters').isLength({ min: 5 }),
    body('description', 'Description must be at least 10 characters').isLength({ min: 10 }),
    body('requirements', 'Requirements must be an array with at least 1 item').isArray({ min: 1 }),
    body('requirements.*', 'Each requirement must be a string').custom((val) => typeof val === 'string'),
    body('salary', 'Salary must be a number').isNumeric(),
    body('experienceLevel', 'Experience level must be a number').isNumeric(),
    body('location', 'Location is required').notEmpty(),
    body('jobType', 'Job type is required').notEmpty(),
    body('position', 'Position is required').isNumeric(),
    body('company', 'Company is required').notEmpty(),
];

const jobUpdateValidation = [
    body('title', 'Title must be at least 5 characters').optional().isLength({ min: 5 }),
    body('description', 'Description must be at least 10 characters').optional().isLength({ min: 10 }),
    body('requirements', 'Requirements must be an array with at least 1 item').optional().isArray({ min: 1 }),
    body('requirements.*', 'Each requirement must be a string').optional().custom(val => typeof val === 'string'),
    body('salary', 'Salary must be a number').optional().isNumeric(),
    body('experienceLevel', 'Experience level must be a number').optional().isNumeric(),
    body('location', 'Location is required').optional().notEmpty(),
    body('jobType', 'Job type is required').optional().notEmpty(),
    body('position', 'Position must be a number').optional().isNumeric(),
    body('company', 'Company is required').optional(),
];

jobRouter.post('/post', isAuthenticated, jobValidation, postJob);
jobRouter.get('/get', getAllJobs);
jobRouter.get('/getAdminJobs', isAuthenticated, getAdminJobs);
jobRouter.get('/get/:id', isAuthenticated, getJobById);
jobRouter.put("/update/:id", isAuthenticated, jobUpdateValidation, updateJob);



export default jobRouter;