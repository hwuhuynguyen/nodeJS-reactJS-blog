const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database.config");
const User = require("./User");
const Post = require("./Post");

const LikePost = sequelize.define(
  "LikePost",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Post,
        key: "id",
      },
    },
  },
  {
    // Specify the table name to match the existing table in the database
    tableName: "like_posts",
    // Disable automatic timestamp fields
    timestamps: false,
  }
);

// Define the association with the 'User' model
LikePost.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Define the association with the 'Post' model
LikePost.belongsTo(Post, { foreignKey: "post_id", as: "post" });

module.exports = LikePost;
