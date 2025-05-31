import express from 'express';
import { registerUser } from '../controller/auth.controller'; // Adjust the import path as necessary
import handleValidation from '../middleware/validator/validator';
import { registerValidation } from '../validations/auth.validations';
import { uploadSingle } from '../middleware/multer/upload';
const router = express.Router();

router.post(
  '/register',
  uploadSingle(
    'profilePicture',[
    'image/jpeg',
    'image/png',
    'image/jpg',
    ]),
  handleValidation(registerValidation),
  registerUser
);

export default router;
