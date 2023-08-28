import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import HomePage from "./pages/home/Home";
import PostsPage from "./pages/post/list/Posts";
import LoginPage from "./pages/login/Login";
import React, { useContext } from "react";
import { AuthContext } from "./context/context";
import RegisterPage from "./pages/register/Register";
import CreatePostPage from "./pages/post/create/CreatePostPage";
import PostDetailPage from "./pages/post/detail/PostDetailPage";
import AboutPage from "./pages/about/detail/AboutPage";
import UpdatePostPage from "./pages/post/update/UpdatePostPage";
import UpdateAboutPage from "./pages/about/update/UpdateAboutPage";
import ErrorPage from "./pages/error/Error";

function App() {
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  console.log("Checking user...", user);

  return (
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/posts" element={<PostsPage />} />
          <Route path="/posts/:postId" element={<PostDetailPage />} /> 
          <Route path="/posts/:postId/update" element={<UpdatePostPage />} /> 
          <Route path="/posts/new" element={<CreatePostPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/about/update" element={<UpdateAboutPage />} /> 
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
