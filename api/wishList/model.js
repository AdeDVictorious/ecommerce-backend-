let db = require('../../db');

module.exports = {
  Product: db.product_table,
  Wishlist: db.wishlist,
  sequelize: db.sequelize,
};
