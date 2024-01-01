const db = require('../../db');

module.exports = {
  Order: db.order_table,
  sequelize: db.sequelize,
  Location: db.location,
  Cart: db.cart_table,
  Product: db.product_table,
  User: db.user,
  Payment: db.payment,
};
