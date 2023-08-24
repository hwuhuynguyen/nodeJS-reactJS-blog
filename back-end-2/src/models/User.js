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
      validate: {
        notNull: {
          args: true,
          msg: 'Please enter your name!'
        },
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Please enter a valid email address',
        },
        async isEmailUnique(email) {
          const existingUser = await User.findOne({ where: { email } });
          if (existingUser) {
            throw new Error('Email address is already in use');
          }
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: 8, 
          msg: 'Password must be at least 8 characters!'
        }
      }
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

