const db = require('../../db');

module.exports = {
  Product: db.product_table,
  sequelize: db.sequelize,
  Upload: db.Image_Upload,
  Review: db.product_review,
};
