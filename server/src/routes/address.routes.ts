import express from 'express';
import authenticate from '../middleware/authentication/authenticate';
import { deleteAddress, getAddressesByTitle, getAllAddresses, registerAddress, updateAddress } from '../controller/address.controller';
import handleValidation from '../middleware/validator/validator';
import { registerAddressValidation, updateAddressValidation } from '../validations/address.validations';
const router = express.Router();

router.get(
    "/all",
    authenticate,
    getAllAddresses
)
router.get(
    "/all/:title",
    authenticate,
    getAddressesByTitle
)

router.post(
    "/addNew",
    handleValidation(registerAddressValidation),
    authenticate,
    registerAddress
    
)
router.put(
  '/update/:addressId',
  authenticate,
  handleValidation(updateAddressValidation),
  updateAddress
);
router.delete(
  '/delete/:addressId',
    authenticate,
  deleteAddress
);



export default router;