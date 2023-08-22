const UserStats = ({title, data}) => {
  console.log("data", data);
  const _URL = "http://localhost:3001";

  const handleAvatarImageError = (event) => {
    console.log("error", event);
    event.target.src = _URL + "/img/default-avatar.png";
  };

  return (
    <>
      <h4>{title}</h4>
      {data.map((user) => {
        return (
          <div key={user.id} className="row card flex-row mx-1 my-2 p-1">
            <div className="col-4">
              {user?.profilePicture?.startsWith("/img") && (
                <div>
                  <img
                    style={{width: "100%", height: "auto"}}
                    className="card-img"
                    src={_URL + user?.profilePicture}
                    alt=""
                    onError={handleAvatarImageError}
                  />
                </div>
              )}
              {!user.profilePicture && <div>
                  <img
                    style={{width: "100%", height: "auto"}}
                    className="card-img"
                    src={_URL + user?.profilePicture}
                    alt=""
                    onError={handleAvatarImageError}
                  />
                </div>}
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