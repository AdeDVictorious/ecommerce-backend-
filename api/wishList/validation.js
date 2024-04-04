let Joi = require('joi');
let { celebrate } = require('celebrate');

class wishlistvalidation {
  //validation for WishList
  validateAddWishList() {
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

  // validation query parameters (req.query)
  validateQuery() {
    return celebrate({
      query: Joi.object({
        id: Joi.string().guid({ version: 'uuidv4' }).required(),
      }),
    });
  }
}

module.exports = wishlistvalidation;
