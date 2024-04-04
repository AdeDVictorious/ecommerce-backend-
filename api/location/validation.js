let Joi = require('joi');
let { celebrate } = require('celebrate');

class locationValidation {
  //validation for Location
  validateLocation() {
    return celebrate({
      body: Joi.object({
        state: Joi.string().lowercase().required(),
        lga: Joi.string().lowercase().required(),
        shipping: Joi.string().lowercase().required(),
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

  //validation for req.params (req.params)
  validateStateID() {
    return celebrate({
      params: Joi.object({
        id: Joi.string().required(),
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

  ///validation to update location details
  validateUpdate() {
    return celebrate({
      body: Joi.object({
        state: Joi.string().lowercase().required(),
        lga: Joi.string().lowercase().required(),
        shipping: Joi.string().lowercase().required(),
      }),
    });
  }
}

module.exports = locationValidation;
