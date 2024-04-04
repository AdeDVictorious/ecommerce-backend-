let Joi = require('joi');
let { celebrate } = require('celebrate');

class cartValidation {
  //validation for Addition of cart qty
  validateAddToCart() {
    return celebrate({
      body: Joi.object({
        product_TableId: Joi.string().guid({ version: 'uuidv4' }).required(),
      }),
    });
  }

  //validation for Addition of cart qty
  validateAddQty() {
    return celebrate({
      body: Joi.object({
        product_TableId: Joi.string().guid({ version: 'uuidv4' }).required(),
      }).unknown(true),
    });
  }

  //validation for subtraction of cart qty
  validateSubtQty() {
    return celebrate({
      body: Joi.object({
        product_TableId: Joi.string().guid({ version: 'uuidv4' }).required(),
      }),
    });
  }

  //validation for req.params (req.params)
  validateParams() {
    return celebrate({
      params: Joi.object({
        id: Joi.string().guid({ version: 'uuidv4' }).required(),
      }),
    });
  }

  ///validation to update cart quantity
  validateUpdate() {
    return celebrate({
      body: Joi.object({
        quantity: Joi.number().integer().min(0).max(Infinity).required(),
      }),
    });
  }
}

module.exports = cartValidation;
