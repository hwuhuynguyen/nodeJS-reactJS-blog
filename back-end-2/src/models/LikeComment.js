const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database.config");
const User = require("./User");
const Comment = require("./Comment");

const LikeComment = sequelize.define(
  "LikeComment",
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
    comment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Comment,
        key: "id",
      },
    },
  },
  {
    // Specify the table name to match the existing table in the database
    tableName: "like_comments",
    // Disable automatic timestamp fields
    timestamps: false,
  }
);

// Define the association with the 'User' model
LikeComment.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Define the association with the 'Comment' model
LikeComment.belongsTo(Comment, { foreignKey: "comment_id", as: "comment" });

module.exports = LikeComment;
