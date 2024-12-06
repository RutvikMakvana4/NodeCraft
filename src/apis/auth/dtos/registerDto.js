import Joi from "joi";

export const registerDto = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().min(8).required().messages({
    "string.min": "Password must be at least 8 characters long.",
  }),
  profilePicture: Joi.string(),
  age: Joi.string(),
});
