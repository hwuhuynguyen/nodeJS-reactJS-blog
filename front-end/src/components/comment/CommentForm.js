import { useContext, useEffect, useRef, useState } from "react";
import Comment from "./Comment";
import "./CommentForm.css";
import { AuthContext } from "../../context/context";

const CommentForm = ({ comments, post }) => {
  const inputRef = useRef(null);
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    console.log("Initial render");
    setCommentList(comments);
  }, [comments]);

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    const content = inputRef.current.value;
    const jwt = localStorage.getItem("jwt");
    // console.log(jwt);
    // console.log(user.id, post.id, content);

    try {
      const response = await fetch(
        `http://localhost:3001/api/posts/${post.id}/comments`,
        {
          method: "POST",
          body: JSON.stringify({
            user_id: user.id,
            post_id: post.id * 1,
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

      console.log(data.data[0]);
      setCommentList((prevCommentList) => {
        console.log("Updating comment list");
        console.log([...prevCommentList, data.data[0]]);
        return [data.data[0], ...prevCommentList];
      });
      inputRef.current.value = "";
    } catch (err) {
      console.log("error: ", err);
    }
  };
  // -----
  const handleReply = (commentIndex, replyText) => {
    setCommentList((prevCommentList) => {
      const newCommentList = [...prevCommentList];
      
      // Insert the new commentText at the specified index
      newCommentList.splice(commentIndex + 1, 0, replyText);
      console.log(replyText);
      return newCommentList;
    });
  
  };
  // -----
  return (
    <div>
      <h1>Comment</h1>
      <div>
        <form id={`commentForm-${post.id}`} onSubmit={handleSubmitComment}>
          <input type="hidden" name="id" />
          <textarea
            type="text"
            name="content"
            cols="100"
            rows="3"
            ref={inputRef}
            required
          ></textarea>
          <br />
          <button className="btn btn-warning" type="submit">
            Comment
          </button>
        </form>
      </div>

      {commentList.map((comment, index) => (
        <Comment
          key={index}
          // key={comment.id}
          comment={comment}
          post={post}
          onReply={(replyText) => handleReply(index, replyText)}
        />
      ))}
    </div>
  );
};

export default CommentForm;
