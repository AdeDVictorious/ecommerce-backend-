const db = require('../../db');

module.exports = {
  User: db.user,
  Cart: db.cart_table,
  ResetPwd: db.resetPwd,
  sequelize: db.sequelize,
};
