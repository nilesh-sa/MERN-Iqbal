import { body } from 'express-validator';

const registerAddressValidation = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string'),

  body('houseNumber')
    .notEmpty().withMessage('House number is required')
    .isString().withMessage('House number must be a string'),

  body('buildingName')
    .notEmpty().withMessage('Building name is required')
    .isString().withMessage('Building name must be a string'),

  body('addressLine1')
    .notEmpty().withMessage('Address Line 1 is required')
    .isString().withMessage('Address Line 1 must be a string'),

  body('addressLine2')
    .notEmpty().withMessage('Address Line 2 is required')
    .isString().withMessage('Address Line 2 must be a string'),

  body('city')
    .notEmpty().withMessage('City is required')
    .isString().withMessage('City must be a string'),

  body('state')
    .notEmpty().withMessage('State is required')
    .isString().withMessage('State must be a string'),

  body('zipCode')
    .notEmpty().withMessage('Zip code is required')
    .isNumeric().withMessage('Zip code must contain only numbers'),

  body('isDefault')
    .optional()
    .isBoolean().withMessage('isDefault must be a boolean (true or false)'),
];

export { registerAddressValidation };
