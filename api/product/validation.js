let Joi = require('joi');
let { celebrate } = require('celebrate');

class productValidation {
  //validation for add product
  validateAddProduct() {
    return celebrate({
      body: Joi.object({
        name: Joi.string().lowercase().required(),
        description: Joi.string().lowercase().required(),
        quantity: Joi.number().integer().min(1).max(100).required(),
        bottleSize: Joi.string().lowercase().required(),
        price: Joi.number().integer().min(1).max(1000000).required(),
        priority: Joi.number().integer().min(1).max(100).required(),
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
  validateSearchQuery() {
    return celebrate({
      query: Joi.object({
        search_query: Joi.string().lowercase().required(),
      }),
    });
  }

  // validate dashboard query
  validatePageQuery() {
    return celebrate({
      query: Joi.object({
        page: Joi.number().integer().min(0).max(100).required(),
      }),
    });
  }

  ///validation to update prduct details
  validateUpdate() {
    return celebrate({
      body: Joi.object({
        name: Joi.string().lowercase().required(),
        quantity: Joi.number().integer().min(1).max(100).required(),
        bottleSize: Joi.string().lowercase().required(),
        price: Joi.number().integer().min(1).max(1000000).required(),
        priority: Joi.number().integer().min(1).max(100).required(),
      }),
    });
  }

  ///validation to update all product details
  validateUpdateAll() {
    return celebrate({
      body: Joi.object({
        name: Joi.string().lowercase().required(),
        description: Joi.string().lowercase().required(),
        quantity: Joi.number().integer().min(1).max(100).required(),
        bottleSize: Joi.string().lowercase().required(),
        price: Joi.number().integer().min(1).max(1000000).required(),
        priority: Joi.number().integer().min(1).max(100).required(),
      }),
    });
  }

  //validation for review
  validateReviews() {
    return celebrate({
      body: Joi.object({
        custName: Joi.string().lowercase().required(),
        custEmail: Joi.string().email().required(),
        custRating: Joi.number().integer().min(1).max(100).required(),
        custMessage: Joi.string().lowercase().required(),
        product_ID: Joi.string().guid({ version: 'uuidv4' }).required(),
      }),
    });
  }
}

module.exports = productValidation;
