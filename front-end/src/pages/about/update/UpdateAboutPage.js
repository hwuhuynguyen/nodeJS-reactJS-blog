import { useContext, useEffect } from "react";
import { AuthContext } from "../../../context/context";
import { useNavigate } from "react-router-dom";
import MainNavigation from "../../../components/navigation/MainNavigation";
import ProfileForm from "../../../components/profile/ProfileForm";
import { ROOT_URL } from "../../../constants";
import Swal from "sweetalert2";

const UpdateAboutPage = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You need to login to access this function!',
        footer: 'You can <a href="/auth/login">login</a> to access this feature',
        confirmButtonText: 'OK! I got it!',
      })
      navigate("/");
      return;
    }

    const jwt = localStorage.getItem('jwt');

    fetch(`${ROOT_URL}/api/v1/dashboard`, {
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