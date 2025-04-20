const { body, validationResult } = require("express-validator");

exports.validatePostData = [
  body("desc")
    .trim()
    .escape()
    .isLength({ max: 500 })
    .withMessage("Description must be at most 500 characters long"),
  body("img").trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
