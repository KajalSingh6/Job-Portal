import express from 'express';
import { loginAuth, logout, registerAuth, updateProfile } from '../controllers/userController.js';
import { body } from 'express-validator';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { singleUpload } from '../middleware/multer.js';

const userRouter = express.Router();

const registerValidation = [
    body("fullName", 'Full name must be at least 3 characters').isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    body("phone", "Enter a valid Indian phone number").matches(/^[6-9]\d{9}$/),
    body("role", "Invalid role").isIn(["student", "recruiter"]),

];

userRouter.post('/register', singleUpload, registerValidation, registerAuth);

const loginValidation = [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").notEmpty(),
    body("role", "Role is required").notEmpty()

];

userRouter.post('/login', loginValidation, loginAuth);

userRouter.post('/logout', logout);

const updateProfileValidation = [
  body('fullName')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Full name must be at least 3 characters'),

  body('phone')
    .optional()
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Enter a valid Indian phone number'),

  body('bio')
    .optional()
    .isLength({ max: 300 })
    .withMessage('Bio max 300 characters'),

  body('skills')
    .optional()
    .custom(value => {
      if (typeof value === "string") {
        JSON.parse(value); // stringified array from FormData
        return true;
      }
      return Array.isArray(value);
    })
    .withMessage('Skills must be an array'),
];


userRouter.put('/profile/update', isAuthenticated, singleUpload, updateProfileValidation, updateProfile);

export default userRouter;