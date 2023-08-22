const connection = require("../config/database.config");

exports.addNewComment = (data) => {
  return new Promise((resolve, reject) => {
    connection.query("INSERT INTO comments SET ?", data, (err, results) => {
      if (err) {
        reject(err);
      } else {
        const insertedCommentId = results.insertId;
        connection.query(
          "SELECT * FROM comments WHERE id = ?",
          insertedCommentId,
          (err, results) => {
            if (err) {
              reject(err);
            } else {
              console.log("Record inserted successfully");
              resolve(results[0]);
            }
          }
        );
      }
    });
  });
};

exports.findAllCommentsByPost = (postId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM comments WHERE post_id = ? ORDER BY path ASC",
      postId,
      (err, results) => {
        if (err) reject(err);
        else {
          if (results.length > 0) {
            console.log("Comments of a post found successfully");
            resolve(results);
          } else {
            reject(new Error("Comment not found"));
          }
        }
      }
    );
  });
};

exports.findCommentById = (commentId) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM comments WHERE id = ?",
      commentId,
      (err, result) => {
        if (err) reject(err);
        else {
          if (result.length > 0) {
            console.log("Comment found successfully");
            resolve(result[0]);
          } else {
            reject(new Error("Comment not found"));
          }
        }
      }
    );
  });
};

exports.updateComment = (comment, id) => {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE comments SET ? WHERE id = ?",
      [comment, id],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          console.log("Comment updated successfully");
          resolve(results);
        }
      }
    );
  });
};

exports.getCommentSortedOfAPost = (id) => {
  return new Promise((resolve, reject) => {
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
    WHERE post_id = ?
    ORDER BY path;
    `;
    connection.query(
      query3,
      id,
      (err, results) => {
        if (err) {
          console.log("__ERROR__");
          reject(err);
        } else {
          console.log("Comment uploaded and sorted successfully");
          resolve(results);
        }
      }
    );
  });
};

exports.findCommentByIdAndItsAuthorAndLikeCount = (id) => {
  return new Promise((resolve, reject) => {
    const query = 
    `SELECT c.id, c.content, c.post_id, c.user_id, c.path, u.name, u.profilePicture , count(lc.id) AS like_count
    FROM comments c
    JOIN users u ON c.user_id = u.id
    LEFT JOIN like_comments lc ON c.id = lc.comment_id
    WHERE c.id = ?
    GROUP BY lc.comment_id;`;
    connection.query(query, id, (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length > 0) {
          console.log("Comments found successfully");
          resolve(results);
        } else {
          reject(new Error("Comment not found"));
        }
      }
    });
  });
};