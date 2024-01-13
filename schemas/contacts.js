const Joi = require("joi");

const addSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": `"name" cannot be an empty field`,
  }),
  email: Joi.string().required().messages({
    "string.empty": `"email" cannot be an empty field`,
  }),
  phone: Joi.string().required().messages({
    "string.empty": `"phone" cannot be an empty field`,
  }),
  favorite: Joi.boolean().messages({
    "boolean.base": `"favorite" should be a type of 'boolean'`,
  }),
});

const addFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required().messages({
    "boolean.empty": `"favorite" cannot be an empty field'`,
  }),
});

module.exports = { addSchema, addFavoriteSchema };
