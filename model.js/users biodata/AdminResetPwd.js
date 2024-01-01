const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const AdminResetToken = sequelize.define(
    'AdminResetToken',
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expirationDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      AdminId: {
        type: DataTypes.UUID,
        allowNull: true,
        primaryKey: true,
      },
    },
    {
      // Other model options go here
      timestamps: true,
      updatedAt: false,
    }
  );

  // AdminResetToken.sync({ alter: true });

  return AdminResetToken;
};
