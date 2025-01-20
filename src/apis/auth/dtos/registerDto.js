import Joi from "joi";

// DTO -> Data Transfer Objects

export const registerDto = Joi.object().keys({
  name: Joi.string().required().messages({
    "any.required": "Name is required.",
    "string.empty": "Name cannot be empty.",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.email": "Please enter a valid email address.",
      "any.required": "Email is required.",
      "string.empty": "Email cannot be empty.",
    }),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long.",
    "any.required": "Password is required.",
    "string.empty": "Password cannot be empty.",
  }),
  age: Joi.number().greater(0).required().messages({
    "number.base": "Age must be a valid number.",
    "number.greater": "Age must be greater than 0.",
    "any.required": "Age is required.",
  }),
  profilePicture: Joi.string().uri().allow(null, "").messages({
    "string.uri": "Profile picture must be a valid URL.",
  }),
  gender: Joi.string().valid("Male", "Female").required().messages({
    "any.only": "Gender must be either 'Male' or 'Female'.",
    "any.required": "Gender is required.",
  }),
  hobbies: Joi.array()
    .items(Joi.string().required())
    .min(2)
    .required()
    .messages({
      "array.base": "Hobbies must be an array.",
      "array.min": "At least 2 hobbies are required.",
    }),
});
