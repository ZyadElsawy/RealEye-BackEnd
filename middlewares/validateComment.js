const { body, validationResult } = require("express-validator");

// Validation middleware
exports.validateCommentData = [
  body("text")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Field is required")
    .isAlphanumeric()
    .withMessage("Field must be alphanumeric"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
