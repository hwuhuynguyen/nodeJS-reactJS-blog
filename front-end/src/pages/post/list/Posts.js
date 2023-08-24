import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/context";
import { Link, useNavigate } from "react-router-dom";
import MainNavigation from "../../../components/navigation/MainNavigation";
import PageContent from "../../../components/shared/PageContent";
import Post from "../../../components/post/PostCard";
import { ROOT_URL } from "../../../constants";
import Swal from "sweetalert2";

function PostsPage() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
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
    } else {
      fetch(`${ROOT_URL}/posts`)
        .then((response) => response.json())
        .then((response) => {
          setPosts(response.posts);
        })
        .catch((err) => console.log(err));
    }

    // if (!user) {
    //   navigate("/auth/login");
    // }
    // fetch(`${ROOT_URL}/posts`)
    //   .then((response) => response.json())
    //   .then((response) => {
    //     setPosts(response.posts);
    //   })
    //   .catch((err) => console.log(err));
  }, [navigate, user]);
  return (
    <>
      <MainNavigation></MainNavigation>
      <main className="container">
        <PageContent title={"List of posts"}>
          <Link to="new">
            <button
              className="btn btn-primary mb-3"
              style={{ position: "absolute", right: "20%", top: "115px" }}
            >
              Create new post
            </button>
          </Link>
          <div className="row">
            <div
              style={{ display: "flex", flexWrap: "wrap" }}
              className="col-12"
            >
              {posts.map((post) => {
                return <Post key={post.id} post={post} col="col-3" />;
              })}
            </div>
          </div>
        </PageContent>
      </main>
    </>
  );
}

export default PostsPage;

export const loader = async () => {
  const response = await fetch(`${ROOT_URL}/posts`);

  if (!response.ok) {
    throw new Response(JSON.stringify({ message: "Could not fetch posts" }), {
      status: 500,
    });
  } else {
    const resData = await response.json();
    return resData.data;
  }
};
