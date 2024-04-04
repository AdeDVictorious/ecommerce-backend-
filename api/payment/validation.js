let Joi = require('joi');
let { celebrate } = require('celebrate');

class paymentValidation {
  //validation for Payment
  validatePayment() {
    return celebrate({
      body: Joi.object({
        PaymentId: Joi.string().lowercase().required(),
        paystackURL: Joi.string().uri().required(),
        OrderTableId: Joi.string().guid({ version: 'uuidv4' }).required(),
        amount: Joi.number().integer().min(1).max(Infinity).required(),
        UserId: Joi.string().guid({ version: 'uuidv4' }).required(),
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
        page: Joi.number().integer().min(1).max(Infinity).required(),
      }),
    });
  }

  ///validation to update payment
  validateUpdate() {
    return celebrate({
      body: Joi.object({
        paymentStatus: Joi.string().lowercase().required(),
      }),
    });
  }
}

module.exports = paymentValidation;
