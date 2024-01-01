const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Review_Table = sequelize.define(
    'Review_Table',
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      custName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      custEmail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      custRating: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      custMessage: {
        type: DataTypes.STRING,
        allowNull: false,
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

  // Review_Table.sync({ alter: false });

  return Review_Table;
};
