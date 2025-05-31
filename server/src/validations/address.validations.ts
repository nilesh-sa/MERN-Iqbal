import { body } from 'express-validator';


export const addressFields = {
  title: body('title')
    .isString().withMessage('Title must be a string'),

  houseNumber: body('houseNumber')
    .isString().withMessage('House number must be a string'),

  buildingName: body('buildingName')
    .isString().withMessage('Building name must be a string'),

  addressLine1: body('addressLine1')
    .isString().withMessage('Address Line 1 must be a string'),

  addressLine2: body('addressLine2')
    .isString().withMessage('Address Line 2 must be a string'),

  city: body('city')
    .isString().withMessage('City must be a string'),

  state: body('state')
    .isString().withMessage('State must be a string'),

  zipCode: body('zipCode')
    .isNumeric().withMessage('Zip code must contain only numbers'),

  isDefault: body('isDefault')
    .isBoolean().withMessage('isDefault must be a boolean (true or false)'),
};
const registerAddressValidation = [
  addressFields.title.notEmpty().withMessage('Title is required'),
  addressFields.houseNumber.notEmpty().withMessage('House number is required'),
  addressFields.buildingName.notEmpty().withMessage('Building name is required'),
  addressFields.addressLine1.notEmpty().withMessage('Address Line 1 is required'),
  addressFields.addressLine2.notEmpty().withMessage('Address Line 2 is required'),
  addressFields.city.notEmpty().withMessage('City is required'),
  addressFields.state.notEmpty().withMessage('State is required'),
  addressFields.zipCode.notEmpty().withMessage('Zip code is required'),
  addressFields.isDefault.optional(),
];
const updateAddressValidation = [
  addressFields.title.optional(),
  addressFields.houseNumber.optional(),
  addressFields.buildingName.optional(),
  addressFields.addressLine1.optional(),
  addressFields.addressLine2.optional(),
  addressFields.city.optional(),
  addressFields.state.optional(),
  addressFields.zipCode.optional(),
  addressFields.isDefault.optional(),
];
export { registerAddressValidation,updateAddressValidation };
