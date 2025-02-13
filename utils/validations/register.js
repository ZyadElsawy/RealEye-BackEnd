const Joi = require("joi");

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(4).max(20).required().messages({
    "string.alphanum": "firstname must only contain alphanumeric characters",
    "string.min": "firstname must be at least 5 characters long",
    "string.max": "firstname cannot be longer than 20 characters",
    "any.required": "firstname is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least {#limit} characters long",
    "any.required": "Password is required",
  }),
});

module.exports = registerSchema;
