import React, { useEffect, useState } from "react";
import classes from "./Register.module.css";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ROOT_URL } from "../../constants";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [dateOfBirth, setDateOfBirth] = useState();
  const [gender, setGender] = useState();
  const [file, setFile] = useState();

  useEffect(() => {
    const user = localStorage.getItem("user");
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated && user) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const newUser = {
      username,
      email,
      password,
      dateOfBirth,
      gender,
    };

    const formData = new FormData();

    // Append the image file
    if (file) {
      // console.log("FILE: ", file.name);
      // const filename = file.name;
      formData.append("profilePicture", file);
      // newUser.img = filename;
    }

    // Append additional data to FormData
    formData.append("name", newUser.username);
    formData.append("email", newUser.email);
    formData.append("password", newUser.password);
    formData.append("dateOfBirth", newUser.dateOfBirth);
    formData.append("gender", newUser.gender);

    console.log(formData);
    console.log(newUser);

    // Display the values
    for (const value of formData.values()) {
      console.log("Form values: ", value);
    }

    try {
      const response = await fetch(`${ROOT_URL}/api/auth/register`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("Form submitted successfully");
        Swal.fire({
          title: "Success!",
          text: "You registered new account!",
          icon: "success",
          timer: 2000,
        });
        navigate("/auth/login");
      } else {
        console.error("Form submission failed");
        const err = await response.json();
        Swal.fire({ 
          title: "Error!",
          html: err.messages?.join('<br>'),
          icon: "error",
          timer: 2000,
          text: err.message
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className={classes.body}>
      <div className={classes.registerContainer}>
        <h2>Register</h2>
        <div>
          <form onSubmit={handleSubmitForm} encType="multipart/form-data">
            <input
              type="text"
              placeholder="Username"
              name="name"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="date"
              name="dateOfBirth"
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
            <br />
            <select
              name="gender"
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="" disabled selected>
                Select your gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <br />
            <input
              type="file"
              name="profilePicture"
              onChange={(e) => setFile(e.target.value)}
            />
            <button type="submit">Register</button>
          </form>
        </div>
        <div className={classes.loginLink}>
          <span> Already have an account? </span>
          <Link to="/auth/login">Login here</Link>
        </div>
        <div className={classes.homeLink}>
          <Link to="/">Continue as Guest</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
