const sequelize = require("../config/database.config");
const Comment = require("../models/Comment");
const User = require("../models/User");

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

exports.getCommentSortedOfAPostAndAddLevel = (id) => {
  const query3 = `
    SELECT c.id, c.content, c.post_id, c.user_id, c.path, u.name,
      (LENGTH(c.path) - LENGTH(REPLACE(c.path, '.', ''))) + 1 AS level
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

exports.getCommentSortedOfAPostAndAddLevelAndIsLikedOrNot = (postId, userId) => {
  const query3 = `
    SELECT c.id, c.content, c.post_id, c.user_id, c.path, u.name,
      (LENGTH(c.path) - LENGTH(REPLACE(c.path, '.', ''))) + 1 AS level,
      CASE WHEN lc.user_id = :userId THEN 1 ELSE 0 END AS isLiked
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN like_comments lc ON c.id = lc.comment_id AND lc.user_id = :userId
    WHERE post_id = :postId
    ORDER BY path;
    `;
  const replacements = {
    postId,
    userId,
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

exports.getCommentSortedOfAPostAndAddLevelAndIsLikedOrNotAndLikeCount = (postId, userId) => {
  const query3 = `
    SELECT c.id, c.content, c.post_id, c.user_id, c.path, u.name,
      (LENGTH(c.path) - LENGTH(REPLACE(c.path, '.', ''))) + 1 AS level,
      CASE WHEN lc.user_id = :userId THEN 1 ELSE 0 END AS isLiked,
      ARRAY_AGG(lc.user_id) as likes
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN like_comments lc ON c.id = lc.comment_id 
    WHERE post_id = :postId
    ORDER BY path;
    `;
  const replacements = {
    postId,
    userId,
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

exports.getCommentSortedOfAPostAndAddLevelAndLikeList = (postId) => {
  const query3 = `
    SELECT c.id, c.content, c.post_id, c.user_id, c.path, u.name,
      (LENGTH(c.path) - LENGTH(REPLACE(c.path, '.', ''))) + 1 AS level,
      (SELECT group_concat(concat_ws(',', user_id) separator ';') 
        FROM like_comments 
        WHERE like_comments.comment_id = c.id) AS likes
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN like_comments lc ON c.id = lc.comment_id AND c.user_id = lc.user_id
    WHERE post_id = :postId
    ORDER BY path;
    `;
  const replacements = {
    postId,
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
