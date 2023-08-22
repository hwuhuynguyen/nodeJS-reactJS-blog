const connection = require("../config/database.config");

exports.getLikesOfAPost = (postId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT count(id) AS like_count FROM like_posts WHERE post_id = ?",
      postId,
      (err, result) => {
        if (err) {
          console.error("error getting like_posts");
          console.log(err.message);
          reject(err);
        } else {
          if (result.length > 0) {
            console.log("Likes of a post found successfully");
            resolve(result);
          } else {
            reject(new Error("Post not found"));
          }
        }
      }
    );
  });
};

exports.getLikesOfAComment = (commentId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT count(id) AS like_count FROM like_comments WHERE comment_id = ?",
      commentId,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          if (result.length > 0) {
            console.log("Record found successfully");
            resolve(result);
          } else {
            reject(new Error("Record not found"));
          }
        }
      }
    );
  });
};

exports.getUsersLikedPost = (postId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT user_id FROM like_posts WHERE post_id = ?",
      postId,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          if (result.length > 0) {
            console.log("Users liked post found successfully");
            resolve(result);
          } else {
            reject(new Error("No one liked this post"));
          }
        }
      }
    );
  });
};

exports.getUsersLikedComment = (commentId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT user_id FROM like_comments WHERE comment_id = ?",
      commentId,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          if (result.length > 0) {
            console.log("Users liked comment found successfully");
            resolve(result);
          } else {
            reject(new Error("No one liked this comment"));
          }
        }
      }
    );
  });
};

exports.addLikeToLikePostList = (userId, postId) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO like_posts SET ?";
    const values = { user_id: userId, post_id: postId }; 
    connection.query(query, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        console.log("Added new like to post like list successfully");
        resolve(result);
      }
    });
  });
};

exports.removeLikeToLikePostList = (userId, postId) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM like_posts WHERE user_id = ? AND post_id = ?";
    connection.query(query, [userId, postId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        console.log("Removed like to post like list successfully");
        resolve(result);
      }
    });
  });
};

exports.addLikeToLikeCommentList = (userId, commentId) => {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO like_comments SET ?";
    const values = { user_id: userId, comment_id: commentId }; 
    connection.query(query, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        console.log("Added new like to comment like list successfully");
        resolve(result);
      }
    });
  });
};

exports.removeLikeToLikeCommentList = (userId, commentId) => {
  return new Promise((resolve, reject) => {
    const query = "DELETE FROM like_comments WHERE user_id = ? AND comment_id = ?";
    connection.query(query, [userId, commentId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        console.log("Removed like to comment like list successfully");
        resolve(result);
      }
    });
  });
};