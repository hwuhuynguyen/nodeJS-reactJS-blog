import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import classes from "./Login.module.css";
import { AuthContext } from "../../context/context";
import Swal from "sweetalert2";
import axios from "axios";
import { LOGIN_FAILURE, LOGIN_SUCCESS, ROOT_URL } from "../../constants";

function LoginPage() {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const user = localStorage.getItem("user");
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated && user) {
      navigate("/");
    }
  }, [navigate]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post(`${ROOT_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      authCtx.dispatch({ type: LOGIN_SUCCESS, payload: res.data.data.user });

      localStorage.setItem("jwt", (res.data.token));
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      localStorage.setItem("isAuthenticated", true);

      Swal.fire({
        title: "Success!",
        text: "Login success!",
        icon: "success",
        timer: 1500
      });
      navigate("/");

    } catch (err) {
      authCtx.dispatch({ type: LOGIN_FAILURE });
      Swal.fire({
        title: "Login failed!",
        text: "Incorrect username or password!",
        icon: "error",
        timer: 1500
      });
    }

    
  };

  return (
    <div className={classes.body}>
      <div className={classes.loginContainer}>
        <h2>Login</h2>
        <div>
          <form method="POST" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Email"
              name="email"
              value={formData.email}
              required
              onChange={handleInputChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              required
              onChange={handleInputChange}
            />
            <button type="submit">Login</button>
          </form>
        </div>
        <div className={classes.registerLink}>
          <span> Don't have an account? </span>{" "}
          <Link to="/auth/register">Register here</Link>
        </div>
        <div className={classes.homeLink}>
          <Link to="/">Continue as Guest</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
