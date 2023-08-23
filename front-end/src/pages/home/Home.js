import { useEffect, useState } from "react";
import PageContent from "../../components/shared/PageContent";
import Post from "../../components/post/PostCard";
import MainNavigation from "../../components/navigation/MainNavigation";
import PostStats from "../../components/statistic/PostStats";
import UserStats from "../../components/statistic/UserStats";
import { ROOT_URL } from "../../constants";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`${ROOT_URL}/api/v1/home-page`);
      const resData = await res.json();
      setPosts(resData.data.posts);
      setRecentPosts(resData.data.recentPosts);
      setActiveUsers(resData.data.activeUsers);
      console.log(resData.data);
    };
    fetchPosts();
  }, []);
  return (
    <>
      <MainNavigation></MainNavigation>
      <main className="container">
        <PageContent title={"Today's top highlights"}>
          <div className="row">
            <div
              style={{ display: "flex", flexWrap: "wrap" }}
              className="col-9"
            >
              {posts.map((post) => {
                return <Post key={post.id} post={post} col="col-6" />;
              })}
            </div>
            <div
              className="col-3"
            >
              <PostStats title={'Recent posts'} data={recentPosts} />
              <hr />
              <UserStats title={'Most active users'} data={activeUsers} />
            </div>
          </div>
        </PageContent>
      </main>
    </>
  );
};

export default HomePage;
