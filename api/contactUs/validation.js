let Joi = require('joi');
let { celebrate } = require('celebrate');

class contactUsValidation {
  //validation for contact us
  validateMessage() {
    return celebrate({
      body: Joi.object({
        custEmail: Joi.string().email().required(),
        custName: Joi.string().lowercase().required(),
        custSubject: Joi.string().lowercase().required(),
        custMessage: Joi.string().lowercase().required(),
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
        page: Joi.number().integer().min(0).max(100).required(),
      }),
    });
  }
}

module.exports = contactUsValidation;
