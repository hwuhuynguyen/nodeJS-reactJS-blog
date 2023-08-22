import { Link } from "react-router-dom";

const PostStats = ({ title, data }) => {
  console.log(data);
  const _URL = "http://localhost:3001";

  const handlePostImageError = (event) => {
    event.target.src = _URL + "/img/default-post-picture.png";
  };

  function formatDate(date) {
    const options = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString(undefined, options);
  }

  return (
    <>
      <h4>{title}</h4>
      {data.map((post) => {
        return (
          <div key={post.id} className="row card flex-row mx-1 my-2 p-1">
            <div className="col-4">
              {post.postPicture.startsWith("/img") && (
                <div>
                  <img
                    style={{width: "100%", height: "auto"}}
                    className="card-img"
                    src={_URL + post.postPicture}
                    alt=""
                    onError={handlePostImageError}
                  />
                </div>
              )}
            </div>
            <div className="col-8" style={{textAlign: "left"}}>
              <h6>
                <Link to={`/posts/${post.id}`}>{post.title}</Link>
              </h6>
              <div className="small">{formatDate(new Date(post.createdAt))}</div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default PostStats;
