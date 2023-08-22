const { query } = require("express");
const connection = require("../config/database.config");

exports.addNewPost = (data) => {
  return new Promise((resolve, reject) => {
    connection.query("INSERT INTO posts SET ?", data, (err, results) => {
      if (err) {
        reject(err);
      } else {
        console.log("New post inserted successfully");
        resolve(results);
      }
    });
  });
};

exports.findAllPosts = () => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM posts", (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length > 0) {
          console.log("Posts found successfully");
          resolve(results);
        } else {
          reject(new Error("Post not found"));
        }
      }
    });
  });
};

exports.findAllPostsAndItsAuthor = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT p.id, p.title, p.content, p.postPicture, p.createdAt, u.name, u.profilePicture " +
        "FROM posts p JOIN users u ON p.author = u.id",
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length > 0) {
            console.log("Posts found successfully");
            resolve(results);
          } else {
            reject(new Error("Post not found"));
          }
        }
      }
    );
  });
};

exports.findAllPostsAndItsAuthorAndStats = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT p.id, p.title, p.content, p.postPicture, p.createdAt, u.name, u.profilePicture, 
      COUNT(DISTINCT c.id) AS comment_count, COUNT(DISTINCT lp.id) AS like_count
      FROM posts p
      JOIN users u ON p.author = u.id
      LEFT JOIN comments c ON p.id = c.post_id
      LEFT JOIN like_posts lp ON p.id = lp.post_id
      GROUP BY p.id, p.title, p.content, p.postPicture, p.createdAt, u.name, u.profilePicture;`;

    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length > 0) {
          console.log("Posts found successfully");
          resolve(results);
        } else {
          reject(new Error("Post not found"));
        }
      }
    });
  });
};

exports.findPostById = (id) => {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM posts WHERE id = ?", id, (err, result) => {
      if (err) {
        reject(err);
      } else {
        if (result.length > 0) {
          console.log("Post found successfully");
          resolve(result);
        } else {
          reject(new Error("Post not found"));
        }
      }
    });
  });
};

exports.findPostByIdAndItsAuthor = (id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT p.id, p.title, p.content, p.postPicture, p.createdAt, u.name, u.profilePicture " +
        "FROM posts p JOIN users u ON p.author = u.id WHERE p.id = ?",
      id,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length > 0) {
            console.log("Posts found successfully");
            resolve(results);
          } else {
            reject(new Error("Post not found"));
          }
        }
      }
    );
  });
};

exports.getPostsByUser = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT p.id, p.title, p.content, p.postPicture, p.createdAt, u.name, u.profilePicture, 
    COUNT(DISTINCT c.id) AS comment_count, COUNT(DISTINCT lp.id) AS like_count
    FROM posts p
    JOIN users u ON p.author = u.id
    LEFT JOIN comments c ON p.id = c.post_id
    LEFT JOIN like_posts lp ON p.id = lp.post_id
    WHERE p.author = ?
    GROUP BY p.id, p.title, p.content, p.postPicture, p.createdAt, u.name, u.profilePicture;`
    connection.query(
      query,
      // "SELECT * FROM posts WHERE author = ?",
      userId,
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          if (result.length > 0) {
            console.log("Posts found successfully");
            resolve(result);
          } else {
            reject(new Error("Post not found"));
          }
        }
      }
    );
  });
};

exports.updatePostById = (id, post) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE posts SET ? WHERE id = ?",
      [post, id],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          console.log("Post updated successfully");
          resolve(results);
        }
      }
    );
  });
};

exports.findPostByIdAndItsAuthorAndLikeCount = (id) => {
  return new Promise((resolve, reject) => {
    const query = 
    `SELECT p.id, p.title, p.content, p.postPicture, p.author, p.createdAt, u.name, u.profilePicture , count(lp.id) AS like_count
    FROM posts p
    JOIN users u ON p.author = u.id
    LEFT JOIN like_posts lp ON p.id = lp.post_id
    WHERE p.id = ?
    GROUP BY lp.post_id;`;
    connection.query(query, id, (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length > 0) {
          console.log("Posts found successfully");
          resolve(results);
        } else {
          reject(new Error("Post not found"));
        }
      }
    });
  });
};

exports.findRecentPosts = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM posts ORDER BY createdAt DESC LIMIT 5",
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          if (results.length > 0) {
            console.log("Posts found successfully");
            resolve(results);
          } else {
            reject(new Error("Post not found"));
          }
        }
      }
    );
  });
}