const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database.config");
const User = require("./User");

const Post = sequelize.define(
  "Post",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'A post title is required!'
        },
        notEmpty: {
          args: true,
          msg: 'Please enter a valid post title!'
        },
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'A post content is required!'
        },
        notEmpty: {
          args: true,
          msg: 'Please enter a valid post content!'
        },
      }
    },
    postPicture: {
      type: DataTypes.STRING,
      defaultValue: "/img/default-post-picture.png",
    },

    author: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    // Specify the table name to match the existing table in the database
    tableName: "posts",
    // Disable automatic timestamp fields
    timestamps: false,
  }
);

// Define the association with the 'User' model
User.hasMany(Post, { foreignKey: 'author', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'author', as: 'user' });

module.exports = Post;