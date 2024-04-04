let Joi = require('joi');
let { celebrate } = require('celebrate');

class orderValidation {
  //validation for Order
  validateOrder() {
    return celebrate({
      body: Joi.object({
        sub_total: Joi.number().integer().min(1).max(Infinity).required(),
        grand_total: Joi.number().integer().min(1).max(Infinity).required(),
        total_shippingFee: Joi.number()
          .integer()
          .min(1)
          .max(Infinity)
          .required(),
        locationId: Joi.string().guid({ version: 'uuidv4' }).required(),
        address: Joi.string().lowercase().required(),
      }).unknown(true),
    });
  }

  //validation for paystack  params
  validatePaystackParams() {
    return celebrate({
      body: Joi.object({
        id: Joi.string().lowercase().required(),
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

  // validation query parameters (req.query)
  validateQuery() {
    return celebrate({
      query: Joi.object({
        page: Joi.number().integer().min(1).max(100).required(),
      }),
    });
  }

  ///validation to update Order
  validateUpdate() {
    return celebrate({
      body: Joi.object({
        paymentStatus: Joi.string().lowercase().required(),
      }),
    });
  }
}

module.exports = orderValidation;
