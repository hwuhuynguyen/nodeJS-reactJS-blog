import { useNavigate } from "react-router-dom";
import MainNavigation from "../../../components/navigation/MainNavigation";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/context";
import Profile from "../../../components/profile/Profile";
import Post from "../../../components/post/PostCard";

const AboutPage = () => {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const navigate = useNavigate();
  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
    }
    console.log("ok");

    const jwt = localStorage.getItem('jwt');

    fetch("http://localhost:3001/api/v1/dashboard", {
      headers: {
        'Authorization': 'Bearer ' + jwt
      }
    })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setMyPosts(response.myPosts);
      })
      .catch((err) => console.log(err));
  }, [navigate, user]);
  return (
    <>
      <MainNavigation />
      <section className="main-content">
        <div className="container my-4">
          <Profile user={user} />

          <div className="row">
            <h2>
              <i className="bi bi-hourglass-top me-2"></i>My posts
            </h2>
            <p>Let's check out what I've posted until now</p>
            {myPosts.map((post) => {
              return <Post key={post.id} post={post} col="col-3" />;
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
