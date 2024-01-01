const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config({ path: 'config.env' });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB,
  process.env.PASSWORD,
  {
    host: 'localhost',
    logging: false,
    port: 5432,
    dialect: 'postgres',
  }
);

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

let db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

////----- Users Models or Schema ----- /////
db.user = require('./model.js/users biodata/users')(sequelize, DataTypes);
db.resetPwd = require('./model.js/users biodata/userResetPwd')(
  sequelize,
  DataTypes
);
//// ----- Product_table Model ----- /////
db.product_table = require('./model.js/product folder/product_table')(
  sequelize,
  DataTypes
);

// db.Image_Upload = require('./model.js/others/contactUs')(sequelize, DataTypes);

db.cart_table = require('./model.js/product folder/cart_table')(
  sequelize,
  DataTypes
);
db.location = require('./model.js/users biodata/location_table')(
  sequelize,
  DataTypes
);
db.order_table = require('./model.js/product folder/order_table')(
  sequelize,
  DataTypes
);

db.payment = require('./model.js/product folder/payment')(sequelize, DataTypes);

db.wishlist = require('./model.js/product folder/wishlist')(
  sequelize,
  DataTypes
);

db.contactUs = require('./model.js/others/contactUs')(sequelize, DataTypes);
db.product_review = require('./model.js/others/review')(sequelize, DataTypes);

////-----  Admin Model or Schema ----- /////
db.admin = require('./model.js/users biodata/admin')(sequelize, DataTypes);
db.adminResetPwd = require('./model.js/users biodata/AdminResetPwd')(
  sequelize,
  DataTypes
);

////----- Users Association of One ----- /////

db.user.hasOne(db.resetPwd, { foreignKey: 'UserId' });
db.resetPwd.belongsTo(db.user);

// db.user.hasMany(db.order_table, { foreignKey: 'UserId' });
// db.order_table.belongsTo(db.user);

////----- Users Association of of Many ----- /////

db.user.hasMany(db.cart_table, { foreignKey: 'UserId' });
db.cart_table.belongsTo(db.user);

db.user.hasMany(db.wishlist, { foreignKey: 'UserId' });
db.wishlist.belongsTo(db.user);

db.user.hasMany(db.contactUs, { foreignKey: 'UserId' });
db.contactUs.belongsTo(db.user);

db.user.hasMany(db.product_review, { foreignKey: 'UserId' });
db.product_review.belongsTo(db.user, { foreignKey: 'UserId' });

db.product_table.hasMany(db.product_review, { foreignKey: 'Product_TableId' });
db.product_review.belongsTo(db.product_table, {
  foreignKey: 'Product_TableId',
});

db.user.hasMany(db.order_table, { foreignKey: 'UserId' });
db.order_table.belongsTo(db.user);

db.user.hasMany(db.payment, { foreignKey: 'UserId' });
db.payment.belongsTo(db.user);

db.order_table.hasMany(db.payment, { foreignKey: 'OrderTableId' });
db.payment.belongsTo(db.order_table);

////----- Admin Association of One ----- /////rs
db.admin.hasOne(db.adminResetPwd, { foreignKey: 'AdminId' });
db.adminResetPwd.belongsTo(db.admin);

db.sequelize.sync({ alter: false });

module.exports = db;
