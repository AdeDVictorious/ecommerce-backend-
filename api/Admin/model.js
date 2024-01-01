let db = require('../../db');

module.exports = {
  Admin: db.admin,
  AdminResetPwd: db.adminResetPwd,
  sequelize: db.sequelize,
};
