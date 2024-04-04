let Joi = require('joi');
let { celebrate } = require('celebrate');

class adminvalidation {
  //validation for signup
  validateSignup() {
    return celebrate({
      body: Joi.object({
        firstName: Joi.string().lowercase().required(),
        lastName: Joi.string().lowercase().required(),
        phoneNo: Joi.string().min(11).max(11).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(3).max(15).required(),
      }).unknown(true),
    });
  }

  //validation for login
  validateLogin() {
    return celebrate({
      body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(3).max(15).required(),
      }).unknown(true),
    });
  }

  //validation for forget password (req.body)
  validateforgetPwd() {
    return celebrate({
      body: Joi.object({
        email: Joi.string().email().required(),
      }),
    });
  }

  //validation for reset password (req.body)
  validateresetPwd() {
    return celebrate({
      body: Joi.object({
        email: Joi.string().email().required(),
      }),
    });
  }

  //validation for reset password token (req.params)
  validateresetToken() {
    return celebrate({
      params: Joi.object({
        id: Joi.string().email().required(),
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

  ///validation to update Admin
  validateUpdate() {
    return celebrate({
      body: Joi.object({
        firstName: Joi.string().lowercase().required(),
        lastName: Joi.string().lowercase().required(),
        phoneNo: Joi.string().min(11).max(11).required(),
      }),
    });
  }
}

module.exports = adminvalidation;
