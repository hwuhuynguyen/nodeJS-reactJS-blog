import React from "react";
import classes from "./PostCard.module.css";
import { Link } from "react-router-dom";
import dateFormat from "dateformat";

function Post({ post, col }) {
  console.log(post);
  const _URL = "http://localhost:3001";

  const handlePostImageError = (event) => {
    event.target.src = _URL + "/img/default-post-picture.png";
  };

  const handleAvatarImageError = (event) => {
    event.target.src = _URL + "/img/default-avatar.png";
  };

  return (
    <div className={col}>
      <div className={classes.card}>
        <Link to={`/posts/${post.id}`}>
          {post.postPicture.startsWith("/img") && (
            <div>
              <img
                className="card-img"
                src={_URL + post.postPicture}
                alt=""
                onError={handlePostImageError}
              />
            </div>
          )}
        </Link>
        <div className={classes.cardBody}>
          <h4 className="card-title">
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
          </h4>
          <p className={classes.textLimit}>{post.content}</p>
          <ul className={`nav ${classes.cardInfo}`}>
            <li className={classes.navItem}>
              <div className={`${classes.navLink} nav-link`}>
                <div className={classes.avatarBox}>
                  <div className="avatar">
                    <img
                      // style={aspect-ratio: 5/4}
                      className={classes.avatarImg}
                      src={_URL + post.profilePicture}
                      alt=""
                      onError={handleAvatarImageError}
                    />
                  </div>
                  <span className={classes.author}>
                    <Link href="/posts">{post.name}</Link>
                  </span>
                </div>
              </div>
            </li>
            <li className={classes.navItem}>
              • {dateFormat(post.createdAt, "mmmm dS, yyyy")}
            </li>
            <li className={classes.navItem}>
            <span>•  </span> 
              <span>
                <i className="bi bi-hand-thumbs-up"></i>
              </span> {post.like_count} 
            </li>
            <li className={classes.navItem}>
              <span>•  </span> 
              <span>
                <i className="bi bi-chat-right"></i>
              </span> {post.comment_count} 
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Post;
