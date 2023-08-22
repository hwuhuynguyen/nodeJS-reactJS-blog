import { useContext, useEffect } from "react";
import MainNavigation from "../../../components/navigation/MainNavigation";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../context/context";
import PostForm from "../../../components/post/PostForm";

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
    if (!user) navigate("/auth/login");
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