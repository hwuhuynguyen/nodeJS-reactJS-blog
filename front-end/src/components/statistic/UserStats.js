import { DEFAULT_AVATAR_IMAGE, ROOT_URL } from "../../constants";

const UserStats = ({title, data}) => {
  const handleAvatarImageError = (event) => {
    event.target.src = ROOT_URL + DEFAULT_AVATAR_IMAGE;
  };

  return (
    <>
      <h4>{title}</h4>
      {data.map((user) => {
        return (
          <div key={user.id} className="row card flex-row mx-1 my-2 p-1">
            <div className="col-4">
              {user.profilePicture.startsWith("/img") && (
                <div>
                  <img
                    style={{width: "100%", height: "auto"}}
                    className="card-img"
                    src={ROOT_URL + user.profilePicture}
                    alt=""
                    onError={handleAvatarImageError}
                  />
                </div>
              )}
            </div>
            <div className="col-8" style={{textAlign: "left"}}>
              <h6>
                {user.name}
              </h6>
              <div className="small">Total posts: {user.totalPosts}</div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default UserStats;