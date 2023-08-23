const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database.config");
const User = require("./User");
const Post = require("./Post");

const Comment = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Post,
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    path: {
      type: DataTypes.STRING,
    },
  },
  {
    // Specify the table name to match the existing table in the database
    tableName: "comments",
    // Disable automatic timestamp fields
    timestamps: false,
  }
);

// Define the association with the 'User' model
Comment.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Define the association with the 'Post' model
Comment.belongsTo(Post, { foreignKey: "post_id", as: "post" });


module.exports = Comment;
