const sequelize = require("../config/database.config");
const Comment = require("../models/Comment");
const User = require("../models/User");
const LikeComment = require("../models/LikeComment");

// exports.addNewComment = (data) => {
//   return new Promise((resolve, reject) => {
//     sequelize.query("INSERT INTO comments SET ?", data, (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         const insertedCommentId = results.insertId;
//         sequelize.query(
//           "SELECT * FROM comments WHERE id = ?",
//           insertedCommentId,
//           (err, results) => {
//             if (err) {
//               reject(err);
//             } else {
//               console.log("Record inserted successfully");
//               resolve(results[0]);
//             }
//           }
//         );
//       }
//     });
//   });
// };

exports.addNewComment = (data) => {
  return Comment.create(data)
    .then((createdComment) => {
      const insertedCommentId = createdComment.id;
      return Comment.findByPk(insertedCommentId, {
        raw: true,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['name', 'profilePicture']
          }
        ]
      });
    })
    .then((insertedComment) => {
      console.log("New comment inserted successfully");
      return insertedComment;
    })
    .catch((error) => {
      throw error;
    });
};

exports.findAllCommentsByPost = (postId) => {
  const query = "SELECT * FROM comments WHERE post_id = ? ORDER BY path ASC";

  return sequelize
    .query(query, {
      replacements: [postId],
      type: sequelize.QueryTypes.SELECT,
    })
    .then((results) => {
      if (results.length > 0) {
        console.log("Comments of a post found successfully");
        return results;
      } else {
        throw new Error("Comment not found");
      }
    })
    .catch((error) => {
      throw error;
    });
};

// exports.findCommentById = (commentId) => {
//   return new Promise((resolve, reject) => {
//     sequelize.query(
//       "SELECT * FROM comments WHERE id = ?",
//       commentId,
//       (err, result) => {
//         if (err) reject(err);
//         else {
//           if (result.length > 0) {
//             console.log("Comment found successfully");
//             resolve(result[0]);
//           } else {
//             reject(new Error("Comment not found"));
//           }
//         }
//       }
//     );
//   });
// };

exports.findCommentById = (commentId) => {
  return Comment.findByPk(commentId)
    .then((comment) => {
      if (comment) {
        console.log("Comment found successfully");
        return comment;
      } else {
        throw new Error("Comment not found");
      }
    })
    .catch((error) => {
      throw error;
    });
};

// exports.updateComment = (comment, id) => {
//   return new Promise((resolve, reject) => {
//     sequelize.query(
//       "UPDATE comments SET ? WHERE id = ?",
//       [comment, id],
//       (err, results) => {
//         if (err) {
//           reject(err);
//         } else {
//           console.log("Comment updated successfully");
//           resolve(results);
//         }
//       }
//     );
//   });
// };

exports.updateComment = (comment, id) => {
  return Comment.update(comment, {
    where: { id: id }
  })
    .then((result) => {
      if (result[0] === 1) {
        console.log("Comment updated successfully");
        return result;
      } else {
        throw new Error("Comment not found");
      }
    })
    .catch((error) => {
      throw error;
    });
};

exports.getCommentSortedOfAPost = (id) => {
  // const query = `
  //   SELECT *
  //   FROM comments
  //   WHERE post_id = ?
  //   ORDER BY
  //     CAST(SUBSTRING_INDEX(path, '.', 1) AS UNSIGNED),
  //     CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(path, '.', -1), '.', 1) AS UNSIGNED),
  //     CAST(SUBSTRING_INDEX(path, '.', -1) AS UNSIGNED)
  // `;
  // const query2 = `
  // SELECT c.id, c.content, c.post_id, c.user_id, c.path, u.name
  // FROM comments c
  // LEFT JOIN users u ON c.user_id = u.id
  // WHERE post_id = ?
  // ORDER BY
  //   CAST(SUBSTRING_INDEX(path, '.', 1) AS UNSIGNED),
  //   CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(path, '.', -1), '.', 1) AS UNSIGNED),
  //   CAST(SUBSTRING_INDEX(path, '.', -1) AS UNSIGNED);
  // `;
  const query3 = `
    SELECT c.id, c.content, c.post_id, c.user_id, c.path, u.name 
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE post_id = :postID
    ORDER BY path;
    `;
  const replacements = {
    postID: id,
  };
  return sequelize
    .query(query3, {
      replacements: replacements,
      type: sequelize.QueryTypes.SELECT,
    })
    .then((results) => {
      console.log("Comment uploaded and sorted successfully");
      return results;
    })
    .catch((error) => {
      throw error;
    });
};

// exports.findCommentByIdAndItsAuthorAndLikeCount = async (id) => {
//   return await Comment.findAll({
//     attributes: [
//       'id',
//       'content',
//       'post_id',
//       'user_id',
//       [sequelize.fn('COUNT', sequelize.col('like_comments.id')), 'like_count']
//     ],
//     include: [
//       {
//         model: User,
//         as: 'user',
//         attributes: ['name', 'profilePicture']
//       },
//       {
//         model: LikeComment,
//         as: 'comment',
//         attributes: []
//       }
//     ],
//     where: {
//       id: id
//     },
//     group: ['Comment.id', 'User.id']
//   })
//     .then((results) => {
//       if (results.length > 0) {
//         console.log("Comments found successfully");
//         return results;
//       } else {
//         throw new Error("Comment not found");
//       }
//     })
//     .catch((error) => {
//       throw error;
//     });
// };

exports.findCommentByIdAndItsAuthorAndLikeCount = async (id) => {
  const query = `
    SELECT c.id, c.content, c.post_id, c.user_id, c.path, u.name, u.profilePicture, COUNT(lc.id) AS like_count
    FROM comments c
    JOIN users u ON c.user_id = u.id
    LEFT JOIN like_comments lc ON c.id = lc.comment_id
    WHERE c.id = :commentId
    GROUP BY c.id, u.id;
  `;
  const replacements = {
    commentId: id,
  };

  return await sequelize
    .query(query, {
      replacements: replacements,
      type: sequelize.QueryTypes.SELECT,
    })
    .then((results) => {
      if (results.length > 0) {
        console.log("Comments found successfully");
        return results;
      } else {
        throw new Error("Comment not found");
      }
    })
    .catch((error) => {
      throw error;
    });
};
