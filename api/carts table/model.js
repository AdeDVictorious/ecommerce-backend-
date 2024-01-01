const db = require('../../db');

module.exports = {
  Product: db.product_table,
  Cart: db.cart_table,
  Location: db.location,
  sequelize: db.sequelize,
};
