import { useContext, useEffect } from "react";
import { AuthContext } from "../../../context/context";
import { useNavigate } from "react-router-dom";
import MainNavigation from "../../../components/navigation/MainNavigation";
import ProfileForm from "../../../components/profile/ProfileForm";

const UpdateAboutPage = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }

    const jwt = localStorage.getItem('jwt');

    fetch("http://localhost:3001/api/v1/dashboard", {
      headers: {
        'Authorization': 'Bearer ' + jwt
      }
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
      })
      .catch((err) => console.log(err));
  }, [navigate, user]);
  return (
    <>
      <MainNavigation />
      <section className="main-content">
        <div className="container my-4">
          <ProfileForm user={user} />
        </div>
      </section>
    </>
  );
}

export default UpdateAboutPage;