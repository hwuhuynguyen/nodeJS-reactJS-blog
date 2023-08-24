import { useContext, useEffect } from "react";
import MainNavigation from "../../../components/navigation/MainNavigation";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/context";
import PostForm from "../../../components/post/PostForm";
import Swal from "sweetalert2";

const CreatePostPage = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const user = authCtx.user;
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
  }, [navigate, user]);
  console.log(user);
  return (
    <>
      <MainNavigation></MainNavigation>
      <main className="container">
        <PostForm />
      </main>
    </>
  );
};

export default CreatePostPage;
