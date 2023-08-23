import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DEFAULT_AVATAR_IMAGE, ROOT_URL } from "../../constants";

const Profile = ({ user }) => {
  const navigate = useNavigate();

  const handleAvatarImageError = (event) => {
    event.target.src = ROOT_URL + DEFAULT_AVATAR_IMAGE;
  };

  function formatDate(date) {
    const options = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString(undefined, options);
  }

  useEffect(() => {
    if (!user) navigate("/auth/login");
  }, [user, navigate]);

  return (
    <div className="row py-4">
      <div className="col-4 px-5">
        <img
          style={{ width: "100%" }}
          src={ROOT_URL + user?.profilePicture}
          alt=""
          onError={handleAvatarImageError}
        />
      </div>
      <div className="col-8">
        <table className="table">
          <tbody>
            <tr>
              <td>
                <h3>Name:</h3>
              </td>
              <td>
                <h3>{user?.name}</h3>
              </td>
            </tr>
            <tr>
              <td>
                <h3>Email:</h3>
              </td>
              <td>
                <h3>{user?.email}</h3>
              </td>
            </tr>
            <tr>
              <td>
                <h3>Gender:</h3>
              </td>
              <td>
                <h3>{user?.gender}</h3>
              </td>
            </tr>
            <tr>
              <td>
                <h3>Date of birth:</h3>
              </td>
              <td>
                <h3>{formatDate(new Date(user?.dateOfBirth))}</h3>
              </td>
            </tr>
            <tr>
              <td>
                <h3>Action:</h3>
              </td>
              <td>
                <Link
                  className="btn btn-warning d-block"
                  to="update"
                  data-toggle="modal"
                  data-target="#exampleModal"
                >
                  Update
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Profile;
