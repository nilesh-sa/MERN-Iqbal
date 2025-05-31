import { body } from "express-validator";

const registerValidation = [
  body("firstName").notEmpty().withMessage("First name is required"),

  body("lastName").notEmpty().withMessage("Last name is required"),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 15 })
    .withMessage("Username must be between 3 and 15 characters")
    .matches(/^[a-zA-Z0-9._-]+$/)
    .withMessage(
      "Username can only contain letters, numbers, dots, underscores, and hyphens"
    ),

  body("email").isEmail().withMessage("Invalid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/
    )
    .withMessage(
      "Password must include uppercase, lowercase, number, and special character"
    ),

  body("dob")
    .notEmpty()
    .withMessage("Date of birth is required")
    .isISO8601()
    .withMessage("Date of birth must be a valid date")
    .custom((value) => {
      const dob = new Date(value);
      if (dob >= new Date()) {
        throw new Error("Date of birth must be a past date");
      }
      return true;
    }),

  body("profilePicture").custom((value, { req }) => {
    if (!req.file) {
      throw new Error("Profile picture is required");
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      throw new Error("Only JPG, JPEG, and PNG files are allowed");
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (req.file.size > maxSize) {
      throw new Error("File size should not exceed 10MB");
    }

    return true;
  }),
];

const loginValidation = [
  body("email").optional().isEmail().withMessage("Invalid email address"),

  body("username").optional()
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 15 })
    .withMessage("Username must be between 3 and 15 characters")
    .matches(/^[a-zA-Z0-9._-]+$/)
    .withMessage(
      "Username can only contain letters, numbers, dots, underscores, and hyphens"
    ),
  body("password").notEmpty().withMessage("Password is required"),
];

const passwordUpdateValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/
    )
    .withMessage(
      "Password must include uppercase, lowercase, number, and special character"
    ),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/
    )
    .withMessage(
      "New password must include uppercase, lowercase, number, and special character"
    ),
];

export { registerValidation, loginValidation ,passwordUpdateValidation};
