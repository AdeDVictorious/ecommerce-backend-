const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Order_Table = sequelize.define(
    'Order_Table',
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      goodsOrder: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      total_quantities: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sub_total: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      total_shippingFee: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      grandTotal: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      locationId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentStatus: {
        type: DataTypes.ENUM('pending', 'success', 'failed'),
        defaultValue: 'pending',
      },
      orderStatus: {
        type: DataTypes.ENUM('pending', 'delivered', 'rejected'),
        defaultValue: 'pending',
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

  // Order_Table.sync({ alter: true });

  return Order_Table;
};
