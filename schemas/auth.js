const Joi = require("joi");

const authSchema = Joi.object({
  email: Joi.string().required().messages({
    "string.empty": `"email" cannot be an empty field`,
  }),
  password: Joi.string().required().messages({
    "string.empty": `"password" cannot be an empty field`,
  }),
});

const emailSchema = Joi.object({
  email: Joi.string().required().messages({
    "string.empty": `"email" cannot be an empty field`,
  }),
});

module.exports = { authSchema, emailSchema };
