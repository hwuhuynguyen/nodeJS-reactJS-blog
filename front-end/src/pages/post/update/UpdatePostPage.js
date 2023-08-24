import { useContext, useEffect } from "react";
import MainNavigation from "../../../components/navigation/MainNavigation";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../context/context";
import PostForm from "../../../components/post/PostForm";
import Swal from "sweetalert2";

const UpdatePostPage = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const user = authCtx.user;
  const params = useParams();
  const location = useLocation();
  const { post } = location.state;
  console.log(post);

  console.log(params);
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
    };
  }, [navigate, user]);

  return (
    <>
      <MainNavigation></MainNavigation>
      <main className="container">
        <PostForm post={post}/>
      </main>
    </>
  );
}

export default UpdatePostPage;