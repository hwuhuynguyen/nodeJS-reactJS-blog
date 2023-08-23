const { query } = require("express");
const sequelize = require("../config/database.config");
const Post = require("../models/Post");
const User = require("../models/User");

// exports.addNewPost = (data) => {
//   return new Promise((resolve, reject) => {
//     sequelize.query("INSERT INTO posts SET ?", data, (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         console.log("New post inserted successfully");
//         resolve(results);
//       }
//     });
//   });
// };

exports.addNewPost = (data) => {
  return Post.create(data)
    .then((result) => {
      console.log("New post inserted successfully");
      return result;
    })
    .catch((error) => {
      throw error;
    });
};

exports.findAllPosts = () => {
  return new Promise((resolve, reject) => {
    sequelize.query("SELECT * FROM posts", (err, results) => {
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
    sequelize.query(
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

// exports.findAllPostsAndItsAuthorAndStats = () => {
//   return new Promise((resolve, reject) => {
//     const query = `SELECT p.id, p.title, p.content, p.postPicture, p.createdAt, u.name, u.profilePicture,
//       COUNT(DISTINCT c.id) AS comment_count, COUNT(DISTINCT lp.id) AS like_count
//       FROM posts p
//       JOIN users u ON p.author = u.id
//       LEFT JOIN comments c ON p.id = c.post_id
//       LEFT JOIN like_posts lp ON p.id = lp.post_id
//       GROUP BY p.id, p.title, p.content, p.postPicture, p.createdAt, u.name, u.profilePicture;`;

//     sequelize.query(query, (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         if (results.length > 0) {
//           console.log("Posts found successfully");
//           resolve(results);
//         } else {
//           reject(new Error("Post not found"));
//         }
//       }
//     });
//   });
// };

exports.findAllPostsAndItsAuthorAndStats = () => {
  const query = `SELECT p.id, p.title, p.content, p.postPicture, p.createdAt, u.name, u.profilePicture, 
    COUNT(DISTINCT c.id) AS comment_count, COUNT(DISTINCT lp.id) AS like_count
    FROM posts p
    JOIN users u ON p.author = u.id
    LEFT JOIN comments c ON p.id = c.post_id
    LEFT JOIN like_posts lp ON p.id = lp.post_id
    GROUP BY p.id, p.title, p.content, p.postPicture, p.createdAt, u.name, u.profilePicture;`;

  return sequelize
    .query(query, { type: sequelize.QueryTypes.SELECT })
    .then((results) => {
      if (results.length > 0) {
        console.log("Posts found successfully");
        return results;
      } else {
        throw new Error("Post not found");
      }
    })
    .catch((error) => {
      throw error;
    });
};

exports.findPostById = (id) => {
  return new Promise((resolve, reject) => {
    sequelize.query("SELECT * FROM posts WHERE id = ?", id, (err, result) => {
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
    sequelize.query(
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
  // return new Promise((resolve, reject) => {
    const query = `SELECT p.id, p.title, p.content, p.postPicture, p.createdAt, u.name, u.profilePicture, 
    COUNT(DISTINCT c.id) AS comment_count, COUNT(DISTINCT lp.id) AS like_count
    FROM posts p
    JOIN users u ON p.author = u.id
    LEFT JOIN comments c ON p.id = c.post_id
    LEFT JOIN like_posts lp ON p.id = lp.post_id
    WHERE p.author = :userID
    GROUP BY p.id, p.title, p.content, p.postPicture, p.createdAt, u.name, u.profilePicture;`;
    const replacements = {
      userID: userId,
    };
    return sequelize
      .query(query, {
        replacements: replacements,
        type: sequelize.QueryTypes.SELECT,
      })
      .then((results) => {
        if (results.length > 0) {
          console.log("Posts found successfully");
          return results;
        } else {
          throw new Error("Post not found");
        }
      })
      .catch((error) => {
        throw error;
      });
  // });
};

// exports.updatePostById = (id, post) => {
//   return new Promise((resolve, reject) => {
//     sequelize.query(
//       "UPDATE posts SET ? WHERE id = ?",
//       [post, id],
//       (err, results) => {
//         if (err) {
//           reject(err);
//         } else {
//           console.log("Post updated successfully");
//           resolve(results);
//         }
//       }
//     );
//   });
// };

exports.updatePostById = (id, post) => {
  return Post.update(post, {
    where: { id: id }
  })
    .then((result) => {
      if (result[0] > 0) {
        console.log("Post updated successfully");
        return result;
      } else {
        throw new Error("Post not found");
      }
    })
    .catch((error) => {
      throw error;
    });
};

exports.findPostByIdAndItsAuthorAndLikeCount = (id) => {
  const query = `SELECT p.id, p.title, p.content, p.postPicture, p.author, p.createdAt, u.name, u.profilePicture , count(lp.id) AS like_count
    FROM posts p
    JOIN users u ON p.author = u.id
    LEFT JOIN like_posts lp ON p.id = lp.post_id
    WHERE p.id = :postID
    GROUP BY lp.post_id;`;
  const replacements = {
    postID: id,
  };
  return sequelize
    .query(query, {
      replacements: replacements,
      type: sequelize.QueryTypes.SELECT,
    })
    .then((results) => {
      if (results.length > 0) {
        console.log("Posts found successfully");
        return results;
      } else {
        throw new Error("Post not found");
      }
    })
    .catch((error) => {
      throw error;
    });
};

// exports.findRecentPosts = () => {
//   return new Promise((resolve, reject) => {
//     sequelize.query(
//       "SELECT * FROM posts ORDER BY createdAt DESC LIMIT 5",
//       (err, results) => {
//         if (err) {
//           reject(err);
//         } else {
//           if (results.length > 0) {
//             console.log("Posts found successfully");
//             resolve(results);
//           } else {
//             reject(new Error("Post not found"));
//           }
//         }
//       }
//     );
//   });
// }

exports.findRecentPosts = async () => {
  return await Post.findAll({
    order: [["createdAt", "DESC"]],
    limit: 5,
  })
    .then((results) => {
      if (results.length > 0) {
        console.log("Posts found successfully");
        return results;
      } else {
        throw new Error("Post not found");
      }
    })
    .catch((error) => {
      throw error;
    });
};
