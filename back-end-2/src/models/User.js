const { DataTypes } = require("sequelize");
const sequelize = require("../config/database.config");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Email address already in use',
      },
      validate: {
        isEmail: {
          msg: 'Invalid email format',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
    },
    profilePicture: {
      type: DataTypes.STRING,
      defaultValue: "/img/default-avatar.png",
    },
  },
  {
    // Specify the table name to match the existing table in the database
    tableName: "users",
    // Disable automatic timestamp fields
    timestamps: false,
  }
);

module.exports = User;

