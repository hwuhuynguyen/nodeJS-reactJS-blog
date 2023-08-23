import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/context";
import Swal from "sweetalert2";
import { ROOT_URL } from "../../constants";

const PostForm = ({ post }) => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const user = authCtx.user;
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [file, setFile] = useState();

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post]);

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const newPost = {
      author: user.id.toString(),
      title,
      content,
    };

    // Create a FormData object
    const formData = new FormData();

    // Append the image file
    if (file) {
      console.log("FILE: ", file.name);
      const filename = file.name;
      formData.append("name", filename);
      formData.append("postPicture", file);
      newPost.img = filename;
    }

    // Append additional data to FormData
    formData.append("author", newPost.author);
    formData.append("title", newPost.title);
    formData.append("content", newPost.content);

    const jwt = localStorage.getItem("jwt");
    console.log(formData);
    console.log(newPost);

    // Display the values
    for (const value of formData.values()) {
      console.log("Form values: ", value);
    }

    try {
      const response = await fetch(
        `${ROOT_URL}/api/posts${post ? `/${post.id}` : ""}`,
        {
          method: post ? "PATCH" : "POST",
          body: formData,
          headers: {
            Authorization: "Bearer " + jwt,
          },
        }
      );

      if (response.ok) {
        console.log("Form submitted successfully");
        const successMessage = post
          ? "Updated your post successfully!"
          : "Created new post successfully!";
        Swal.fire({
          title: "Success!",
          text: successMessage,
          icon: "success",
          timer: 2000,
        });

        const targetRoute = post ? `/posts/${post.id}` : "/posts";
        navigate(targetRoute);
      } else {
        console.error("Form submission failed");
        console.log(response);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div
      style={{ width: "50%" }}
      className="d-flex flex-column justify-content-center m-auto"
    >
      <p className="h1 my-4 mx-auto">
        {!post ? "Create new post" : "Update post"}
      </p>
      <form encType="multipart/form-data" onSubmit={handleSubmitForm}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            placeholder=""
            required
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></input>
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">
            Content
          </label>
          <textarea
            className="form-control"
            id="content"
            rows="3"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="formFile" className="form-label">
            Post picture
          </label>
          <input
            className="form-control"
            type="file"
            id="formFile"
            name="postPicture"
            onChange={(e) => setFile(e.target.files[0])}
          ></input>
        </div>
        <div className="mb-3 d-flex justify-content-evenly">
          <Link to="/posts">
            <button className="btn btn-primary">Back to list</button>
          </Link>
          <button className="btn btn-primary">
            {!post ? "Create" : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
