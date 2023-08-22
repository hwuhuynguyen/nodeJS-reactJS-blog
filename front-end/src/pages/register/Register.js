import React, { useState } from "react";
import classes from "./Register.module.css";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [dob, setDob] = useState();
  const [gender, setGender] = useState();
  const [file, setFile] = useState();

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    const newUser = {
      username,
      email,
      password,
      dob,
      gender,
    };

    // Create a FormData object
    const formData = new FormData();

    // Append the image file
    if (file) {
      console.log("FILE: ", file.name);
      const filename = file.name;
      formData.append("name", filename);
      formData.append("profilePicture", file);
      newUser.img = filename;
    }

    // Append additional data to FormData
    formData.append("name", newUser.username);
    formData.append("email", newUser.email);
    formData.append("password", newUser.password);
    formData.append("dob", newUser.dob);
    formData.append("gender", newUser.gender);

    console.log(formData);
    console.log(newUser);

    // Display the values
    for (const value of formData.values()) {
      console.log("Form values: ", value);
    }

    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        body: formData, // Use the FormData object
      });

      if (response.ok) {
        console.log("Form submitted successfully");
      } else {
        console.error("Form submission failed");
        console.log(response);
      }
      navigate("/posts");
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
              onChange={(e) => setDob(e.target.value)}
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
