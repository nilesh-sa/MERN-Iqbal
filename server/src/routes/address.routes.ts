import express from 'express';
import authenticate from '../middleware/authentication/authenticate';
import { registerAddress } from '../controller/address.controller';
import handleValidation from '../middleware/validator/validator';
import { registerAddressValidation } from '../validations/address.validations';
const router = express.Router();


router.post(
    "/addNew",
    handleValidation(registerAddressValidation),
    authenticate,
    registerAddress
    
)



export default router;