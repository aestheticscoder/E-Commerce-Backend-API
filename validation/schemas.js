const Joi = require('joi');

const userValidation = {
  register: Joi.object({
    name: Joi.string().required().min(3),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6)
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

const productValidation = {
  create: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    stock: Joi.number().required().min(0)
  }),
  
  update: Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    price: Joi.number().min(0),
    stock: Joi.number().min(0)
  })
};

const orderValidation = {
  create: Joi.object({
    products: Joi.array().items(
      Joi.object({
        product: Joi.string().required(),
        quantity: Joi.number().required().min(1)
      })
    ).required(),
  })
};

module.exports = {
  userValidation,
  productValidation,
  orderValidation
};