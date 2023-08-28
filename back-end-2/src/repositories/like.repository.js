const sequelize = require("../config/database.config");
const LikePost = require("../models/LikePost");
const LikeComment = require("../models/LikeComment");

exports.getLikesOfAPost = (postId) => {
  return new Promise((resolve, reject) => {
    sequelize.query(
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

exports.getLikesOfAComment = async (commentId) => {
  return await LikeComment.findAll({
    raw: true,
    attributes: [
      [sequelize.fn('COUNT', 'id'), 'like_count']
    ],
    where: {
      comment_id: commentId
    }
  }).then((results) => {
    if (results.length > 0) {
      console.log("Number of like for this comment found successfully");
      return results;
    } else {
      throw new Error("No one liked this comment");
    }
  })
  .catch((error) => {
    throw error;
  });
};

exports.getUsersLikedPost = async(postId) => {
  return await LikePost.findAll({
    raw: true,
    where: {
      post_id: postId
    }
  })
    .then((results) => {
      if (results.length > 0) {
        console.log("Users liked post found successfully");
        return results;
      } else {
        throw new Error("No one liked this post");
      }
    })
    .catch((error) => {
      throw error;
    });
};

exports.getUsersLikedComment = async (commentId) => {
  return await LikeComment.findAll({
    raw: true,
    where: {
      comment_id: commentId
    }
  })
    .then((results) => {
      if (results.length > 0) {
        console.log("Users liked comment found successfully");
        return results;
      } else {
        throw new Error("No one liked this comment");
      }
    })
    .catch((error) => {
      throw error;
    });
};

exports.addLikeToLikePostList = (userId, postId) => {
  return LikePost.create({ user_id: userId, post_id: postId })
    .then((result) => {
      console.log("Added new like to post like list successfully");
      return result;
    })
    .catch((err) => {
      throw err;
    });
};

exports.removeLikeToLikePostList = (userId, postId) => {
  return LikePost.destroy({
    where: { user_id: userId, post_id: postId }
  })
    .then((result) => {
      console.log("Removed like from post like list successfully");
      return result;
    })
    .catch((err) => {
      throw err;
    });
};

exports.addLikeToLikeCommentList = (userId, commentId) => {
  return LikeComment.create({ user_id: userId, comment_id: commentId })
    .then((result) => {
      console.log("Added new like to comment like list successfully");
      return result;
    })
    .catch((err) => {
      throw err;
    });
};

exports.removeLikeToLikeCommentList = (userId, commentId) => {
  return LikeComment.destroy({
    where: { user_id: userId, comment_id: commentId }
  })
    .then((result) => {
      console.log("Removed like from comment like list successfully");
      return result;
    })
    .catch((err) => {
      throw err;
    });
};

exports.checkUserLikedPostOrNot = (userId, postId) => {
  const query = `SELECT CASE WHEN lp.user_id = :userId THEN 1 ELSE 0 END AS isLiked 
    FROM posts p
    LEFT JOIN like_posts lp ON p.id = lp.post_id AND lp.user_id = :userId 
    WHERE p.id = :postId;`;
	const replacements = {
    userId,
		postId
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
}