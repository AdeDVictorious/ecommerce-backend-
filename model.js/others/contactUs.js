const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const ContactUs_Table = sequelize.define(
    'ContactUs_Table',
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
      custSubject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      custMessage: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      UserId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    {
      // Other model options go here
      timestamps: true,
    }
  );

  // ContactUs_Table.sync({ alter: false });

  return ContactUs_Table;
};
