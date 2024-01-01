const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const ResetToken = sequelize.define(
    'ResetToken',
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
      UserId: {
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

  // ResetToken.sync({ alter: true });

  return ResetToken;
};
