const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Location_Table = sequelize.define(
    'Location_Table',
    {
      // Model attributes are defined here
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lga: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shipping: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      // Other model options go here
      timestamps: true,
    }
  );

  // Location_Table.sync({ alter: true });

  return Location_Table;
};
