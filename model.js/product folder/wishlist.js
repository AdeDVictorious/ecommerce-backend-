const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Wishlist_Table = sequelize.define(
    'Wishlist_Table',
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      Product_TableId: {
        type: DataTypes.UUID,
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

  // Wishlist_Table.sync({ alter: true });

  return Wishlist_Table;
};
