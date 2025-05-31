import express from 'express';
import { registerUser, userLogin, VerifyUserAccount } from '../controller/auth.controller'; // Adjust the import path as necessary
import handleValidation from '../middleware/validator/validator';
import { loginValidation, registerValidation } from '../validations/auth.validations';
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
router.post(
  '/login',
  handleValidation(loginValidation),
  userLogin 
);
router.post(
"/verifyAccount",
VerifyUserAccount 
);

export default router;
