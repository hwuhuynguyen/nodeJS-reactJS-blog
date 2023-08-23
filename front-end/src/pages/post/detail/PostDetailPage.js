import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainNavigation from "../../../components/navigation/MainNavigation";
import PostDetail from "../../../components/post/PostDetail";
import { AuthContext } from "../../../context/context";
import CommentForm from "../../../components/comment/CommentForm";
import { ROOT_URL } from "../../../constants";

const PostDetailPage = () => {
  const params = useParams();
  const postId = params.postId;
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const navigate = useNavigate();

  useEffect(() => {
    console.log('user: ' + user);
    if (!user) {
      navigate('/auth/login');
      return;
    }
    const fetchData = async () => {
      try {
        const jwt = localStorage.getItem("jwt");
        console.log("Bearer " + jwt);
        console.log(`${ROOT_URL}/api/v1/posts/${postId}`);

        const response = await fetch(
          `${ROOT_URL}/api/v1/posts/${postId}`,
          {
            headers: {
              Authorization: "Bearer " + jwt,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setPost(data.post);
        setComments(data.comments);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchData();
    return () => {
      // Cleanup logic (if needed)
    };
  }, [postId, user, navigate]);

  return (
    <>
      <MainNavigation></MainNavigation>
      <main className="container">
        <PostDetail post={post} />
        <CommentForm comments={comments} post={post}/>
      </main>
    </>
  );
};

export default PostDetailPage;
