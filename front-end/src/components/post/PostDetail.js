import LoremIpsum from "react-lorem-ipsum";
import classes from "./PostDetail.module.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/context";
import { useNavigate } from "react-router-dom";

const PostDetail = ({ post }) => {
  const _URL = "http://localhost:3001";
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;

  const [like, setLike] = useState(post.like_count);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  useEffect(()=> {
    setLike(post.like_count);
    setIsLiked(post.isLiked);
  }, [post.isLiked, post.like_count]);

  const handlePostImageError = (event) => {
    event.target.src = _URL + "/img/default-post-picture.png";
  };

  const formatDate = (date) => {
    const options = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const handleLikePost = async (event) => {
    const jwt = localStorage.getItem("jwt");
    const response = await fetch(
      `http://localhost:3001/api/posts/${post.id}/like/post`,
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
    setLike(data.data.post.like_count);
    setIsLiked(!isLiked);
  };

  const handleUpdatePost = (event) => {
    navigate(`/posts/${post.id}/update`, { state: { post: post } });
  }

  return (
    <div className="row mt-3">
      <div className="col-4">
        {post.postPicture?.startsWith("/img") && (
          <div>
            <img
              className="card-img"
              src={_URL + post.postPicture}
              alt=""
              onError={handlePostImageError}
            />
          </div>
        )}
      </div>
      <div className="col-8">
        <h1>{post.title}</h1>
        <ul className="nav card-info d-flex justify-content-end">
          <li className={classes.navItem}>
            <div className="avatar-box">
              <span className="author">{post.name}</span>
            </div>
          </li>
          <li className={classes.navItem}>
            • {formatDate(new Date(post.createdAt))}
          </li>
        </ul>
        <hr></hr>
        <ul className="nav card-info d-flex">
          <li className={classes.navItem}>
            <span className="strong">Like: </span>
            <span id="likeCount-<%= post.id %>"> {like ? like : 0}</span>
          </li>
          <li className={classes.navItem}>
            <button
              id="likePost-button"
              className={`btn ${isLiked ? "btn-primary" : "btn-light"}`}
              onClick={handleLikePost}
            >
              Like
            </button>
            {user.id === post.author && <button
              id="updatePost-button"
              className="btn btn-warning ms-3"
              onClick={handleUpdatePost}
            >
              Update
            </button>}
          </li>
        </ul>
        <hr></hr>
        <p>{post.content}</p>
        <LoremIpsum p={2} />
      </div>
    </div>
  );
};

export default PostDetail;
