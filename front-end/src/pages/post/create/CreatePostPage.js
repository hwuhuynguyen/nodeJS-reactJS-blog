import { useContext, useEffect } from "react";
import MainNavigation from "../../../components/navigation/MainNavigation";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/context";
import PostForm from "../../../components/post/PostForm";

const CreatePostPage = () => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const user = authCtx.user;
  useEffect(() => {
    if (!user) navigate("/auth/login");
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
}

export default CreatePostPage;