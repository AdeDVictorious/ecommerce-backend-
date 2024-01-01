const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Payment_Table = sequelize.define(
    'Payment_Table',
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      paystackURL: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      OrderTableId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      PaymentId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.BIGINT,
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

  // Payment_Table.sync({ alter: true });

  return Payment_Table;
};
