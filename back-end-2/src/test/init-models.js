var DataTypes = require("sequelize").DataTypes;
var _comments = require("./comments");
var _like_comments = require("./like_comments");
var _like_posts = require("./like_posts");
var _posts = require("./posts");
var _users = require("./users");

function initModels(sequelize) {
  var comments = _comments(sequelize, DataTypes);
  var like_comments = _like_comments(sequelize, DataTypes);
  var like_posts = _like_posts(sequelize, DataTypes);
  var posts = _posts(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  like_comments.belongsTo(comments, { as: "comment", foreignKey: "comment_id"});
  comments.hasMany(like_comments, { as: "like_comments", foreignKey: "comment_id"});
  comments.belongsTo(posts, { as: "post", foreignKey: "post_id"});
  posts.hasMany(comments, { as: "comments", foreignKey: "post_id"});
  like_posts.belongsTo(posts, { as: "post", foreignKey: "post_id"});
  posts.hasMany(like_posts, { as: "like_posts", foreignKey: "post_id"});
  comments.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(comments, { as: "comments", foreignKey: "user_id"});
  like_comments.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(like_comments, { as: "like_comments", foreignKey: "user_id"});
  like_posts.belongsTo(users, { as: "user", foreignKey: "user_id"});
  users.hasMany(like_posts, { as: "like_posts", foreignKey: "user_id"});
  posts.belongsTo(users, { as: "author_user", foreignKey: "author"});
  users.hasMany(posts, { as: "posts", foreignKey: "author"});

  return {
    comments,
    like_comments,
    like_posts,
    posts,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
