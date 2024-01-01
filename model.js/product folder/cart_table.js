const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Cart_Table = sequelize.define(
    'Cart_Table',
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      product_TableId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      UserId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      // Other model options go here
      timestamps: true,
    }
  );

  // Cart_Table.sync({ force: true });

  return Cart_Table;
};
