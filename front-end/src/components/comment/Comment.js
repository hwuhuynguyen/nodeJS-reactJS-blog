import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/context";
import { ROOT_URL } from "../../constants";

const Comment = ({ comment, onReply }) => {
  const inputRef = useRef(null);
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const [like, setLike] = useState(comment.like);
  const [isLiked, setIsLiked] = useState(comment.isLiked);

  const handleReplyComment = async (event) => {
    event.preventDefault();
    const content = inputRef.current.value;
    const jwt = localStorage.getItem("jwt");

    try {
      const response = await fetch(
        `${ROOT_URL}/api/posts/${comment.post_id}/comments/${comment.id}`,
        {
          method: "POST",
          body: JSON.stringify({
            user_id: user.id,
            post_id: comment.post_id * 1,
            content: content,
          }),
          headers: {
            "Content-Type": "application/json", // Set the content type header
            Authorization: "Bearer " + jwt,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add new comment");
      }
      const data = await response.json();

      data.data[0].level = comment.level + 1;
      onReply(data.data[0]);

      inputRef.current.value = "";
    } catch (err) {
      console.log("error: ", err);
    }
  };

  useEffect(() => {
    setLike(comment.like);
    setIsLiked(comment.isLiked);
  }, [comment.like, comment.isLiked]);

  const handleLikeComment = async (event) => {
    const jwt = localStorage.getItem("jwt");
    const response = await fetch(
      `${ROOT_URL}/api/posts/${comment.post_id}/comments/${comment.id}/like/comment`,
      {
        headers: {
          Authorization: "Bearer " + jwt,
        },
        method: "PATCH",
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    setLike(data.data.comment.like_count);
    setIsLiked(!isLiked);
  };
  return (
    <div
      className={`pt-3 left-indent-${comment.level} ${
        comment.level === 1 ? "mt-3" : ""
      }`}
    >
      {comment.level === 1 && <hr />}
      <h5>{comment.content}</h5>
      <p className="m-0">User: {comment.name}</p>
      <button
        onClick={handleLikeComment}
        className={`btn ${isLiked ? "btn-primary" : "btn-light"}`}
      >
        Like
      </button>
      <span className="strong">Like: </span>
      <span>{like ? like : 0}</span>
      <div className="pt-2">
        <form>
          <textarea
            type="text"
            name="content"
            cols="100"
            rows="1"
            required
            ref={inputRef}
          ></textarea>
          <br />
          <button
            className="btn btn-warning"
            type="submit"
            onClick={handleReplyComment}
          >
            Reply
          </button>
        </form>
      </div>
    </div>
  );
};

export default Comment;
