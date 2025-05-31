import express from 'express';
import { changedPassword, registerUser, userLogin, VerifyUserAccount } from '../controller/auth.controller'; // Adjust the import path as necessary
import handleValidation from '../middleware/validator/validator';
import { loginValidation, passwordUpdateValidation, registerValidation } from '../validations/auth.validations';
import { uploadSingle } from '../middleware/multer/upload';
import authenticate from '../middleware/authentication/authenticate';
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
router.patch(
  "/updatePassword",
  handleValidation(passwordUpdateValidation),
   authenticate,
  changedPassword
)

export default router;
